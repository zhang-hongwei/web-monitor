// import "@fastly/performance-observer-polyfill/polyfill";
import { addListener, onload as loaded } from "./utils/index.js";

let performance =
  window.performance ||
  window.mozPerformance ||
  window.msPerformance ||
  window.webkitPerformance;

class Perf {
  constructor(options) {
    this._options = options;
    this.isOnload = false;
    this.isDOMReady = false;
    this.cycleFreq = 100;

    this.domready(() => {
      let perfData = this.getTimingReport();
      perfData.type = "domready";
      options.timingReport(perfData);
    });
    this.onload(() => {
      let perfData = this.getTimingReport();
      perfData.type = "onload";
      options.timingReport(perfData);
    });

    loaded(this.getResourceReport.bind(this));
  }

  getResourceReport() {
    // 过滤无效数据
    function filterTime(a, b) {
      return a > 0 && b > 0 && a - b >= 0 ? a - b : undefined;
    }

    let resolvePerformanceTiming = (timing) => {
      let o = {
        initiatorType: timing.initiatorType,
        name: timing.name,
        duration: parseInt(timing.duration),
        redirect: filterTime(timing.redirectEnd, timing.redirectStart), // 重定向
        dns: filterTime(timing.domainLookupEnd, timing.domainLookupStart), // DNS解析
        connect: filterTime(timing.connectEnd, timing.connectStart), // TCP建连
        network: filterTime(timing.connectEnd, timing.startTime), // 网络总耗时

        send: filterTime(timing.responseStart, timing.requestStart), // 发送开始到接受第一个返回
        receive: filterTime(timing.responseEnd, timing.responseStart), // 接收总时间
        request: filterTime(timing.responseEnd, timing.requestStart), // 总时间

        ttfb: filterTime(timing.responseStart, timing.requestStart), // 首字节时间
      };

      return o;
    };

    const resolveEntries = (entries) =>
      entries.map((item) => resolvePerformanceTiming(item));

    if (window.PerformanceObserver) {
      const observer = new PerformanceObserver((list) => {
        try {
          let entries = list.getEntries();
          this._options.resourceReport(resolveEntries(entries));
        } catch (e) {
          console.error(e);
        }
      });
      observer.observe({
        entryTypes: options.type ? options.type : ["resource"],
      });
    } else {
      onload(() => {
        let entries = performance.getEntriesByType("resource");
        // cb(resolveEntries(entries));
      });
    }
  }

  getTimingReport() {
    if (!performance) {
      return void 0;
    }

    // 过滤无效数据；
    function filterTime(a, b) {
      return a > 0 && b > 0 && a - b >= 0 ? a - b : undefined;
    }

    // append data from window.performance
    let timing = performance.timing;

    let perfData = {
      // 网络建连
      pervPage: filterTime(timing.fetchStart, timing.navigationStart), // 上一个页面
      redirect: filterTime(timing.responseEnd, timing.redirectStart), // 页面重定向时间
      dns: filterTime(timing.domainLookupEnd, timing.domainLookupStart), // DNS查找时间
      connect: filterTime(timing.connectEnd, timing.connectStart), // TCP建连时间
      network: filterTime(timing.connectEnd, timing.navigationStart), // 网络总耗时

      // 网络接收
      send: filterTime(timing.responseStart, timing.requestStart), // 前端从发送到接收到后端第一个返回
      receive: filterTime(timing.responseEnd, timing.responseStart), // 接受页面时间
      request: filterTime(timing.responseEnd, timing.requestStart), // 请求页面总时间

      // 前端渲染
      dom: filterTime(timing.domComplete, timing.domLoading), // dom解析时间
      loadEvent: filterTime(timing.loadEventEnd, timing.loadEventStart), // loadEvent时间
      frontend: filterTime(timing.loadEventEnd, timing.domLoading), // 前端总时间

      // 关键阶段
      load: filterTime(timing.loadEventEnd, timing.navigationStart), // 页面完全加载总时间
      domReady: filterTime(
        timing.domContentLoadedEventStart,
        timing.navigationStart
      ), // domready时间
      interactive: filterTime(timing.domInteractive, timing.navigationStart), // 可操作时间
      ttfb: filterTime(timing.responseStart, timing.navigationStart), // 首字节时间
    };

    return perfData;
  }

  // DOM解析完成
  domready(callback) {
    let that = this;
    if (this.isOnload === true) {
      return void 0;
    }
    let timer = null;

    if (document.readyState === "interactive") {
      runCheck();
    } else if (document.addEventListener) {
      document.addEventListener(
        "DOMContentLoaded",
        function () {
          runCheck();
        },
        false
      );
    } else if (document.attachEvent) {
      document.attachEvent("onreadystatechange", function () {
        runCheck();
      });
    }

    function runCheck() {
      if (performance.timing.domInteractive) {
        clearTimeout(timer);
        callback();
        that.isDOMReady = true;
      } else {
        timer = setTimeout(runCheck, that.cycleFreq);
      }
    }
  }

  // 页面加载完成
  onload(callback) {
    let that = this;
    let timer = null;

    if (document.readyState === "complete") {
      runCheck();
    } else {
      addListener(
        window,
        "load",
        function () {
          runCheck();
        },
        false
      );
    }

    function runCheck() {
      if (performance.timing.loadEventEnd) {
        clearTimeout(timer);
        callback();
        this.isOnload = true;
      } else {
        timer = setTimeout(runCheck, that.cycleFreq);
      }
    }
  }
}

export default Perf;
