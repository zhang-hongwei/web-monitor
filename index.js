/*
 * @Author: zhanghongwei
 * @Date: 2020-05-23 14:36:43
 * @Last Modified by: zhanghongwei
 * @Last Modified time: 2020-05-23 15:27:13
 */

// import Perf from "./performance";
// import { proxy as ajaxHook, unProxy } from "./ajaxHook/xhr-proxy";
// // import worker from "./worker";

// import ErrorCatch from "./error/index.js";

// class Monitor {
//   constructor() {
//     this.init();
//   }

//   init() {
//     // worker();
//     // 收集ajax fetch
//     ajaxHook({
//       //请求成功后进入
//       onResponse: (response, handler) => {
//         handler.next(response);
//       },
//     });

//     // 性能监控
//     const pf = new Perf({
//       timingReport: (data) => {
//         console.log(123);
//         console.log("data=======>", data);
//       },
//       resourceReport: (data) => {},
//     });

//     // 收集错误信息
//     const error = new ErrorCatch({
//       callback: (err) => {
//         console.log("err================<", err);
//       },
//     });
//   }
// }

// new Monitor();
import { _, userAgent, addListener } from "./utils/index";

// let infos = _.info.properties(),;
window._ = _;

console.log("infos======>", _);
