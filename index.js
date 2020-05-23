// import Perf from "./performance";

// import { proxy as ajaxHook, unProxy } from "./ajaxHook/xhr-proxy";
// import worker from "./worker";
// // import { domready } from "./utils/index.js";
import errorCatch from "./error/index.js";

// class Monitor {
//   constructor() {
//     // domready(this.init.bind(this));
//     // console.log(123123123123);
//     this.init();
//   }

//   init() {
//     // worker();
//     // console.log(123123123123);
//     // 收集ajax fetch
//     ajaxHook({
//       //请求成功后进入
//       onResponse: (response, handler) => {
//         handler.next(response);
//       },
//     });

//     // 性能监控
//     const pf = new Perf({
//       callback: (performances) => {
//         console.log("performances=====callback===>", performances.getEntries());
//       },
//       report: (data) => {
//         console.log(123);
//         console.log("data=======>", data);
//       },
//       resourceReport: () => {},
//     });

//     // 收集错误信息
//   }
// }

// new Monitor();
// // export default Monitor;
console.log("err================<", 123123);
errorCatch.init((err) => {
  console.log("err================<", err);
});
