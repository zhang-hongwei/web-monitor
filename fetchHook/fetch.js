var oldFetchfn = fetch;
//iOS WKwebview判断
if (oldFetchfn && window.webkit && window.webkit.messageHandlers) {
  var current = new Date().getTime();
  current = parseInt((current / 1000) % 100000);
  var messageId = current + 1;
  var globalId = null;
  //定义新的fetch方法，封装原有的fetch方法
  //可定义成widow方法全局覆盖 也可export输出新的fetch模块这是就需要业务方使用新的fetch请求
  window.fetch = function (input, opts) {
    //处理多个并发请求 每个请求回调赋值id
    globalId = messageId;
    messageId++;
    var message = {};
    message.id = globalId;
    message.data = opts.body;
    message.method = opts.method;
    message.url = input;
    message.headers = opts.headers;
    //判断iOS端cookie是否丢失 判断依据根据自己业务使用的关键cookie判断，
    //下面的判断是我本人业务开发时的关键cookie
    if (
      document.cookie.indexOf("PPU=") == -1 ||
      document.cookie.indexOf("sign=") == -1 ||
      document.cookie.indexOf("source=") == -1
    ) {
      return new Promise((resolve, reject) => {
        //此处是根据自己APP业务处理的 仅供参考
        var callback = "fetch_callback" + globalId;
        window[callback] = function (id, native) {
          //native端完成网络请求返回response结果 resolve给业务调用方
          if ((globalId = id && native)) {
            resolve(JSON.parse(native.data));
          }
          globalId = null;
        };
        //此处调用native端request网络请求
        WEBAPP.ajax(
          message.url,
          message.data,
          message.method,
          callback,
          message.headers,
          message.id
        );
      });
    } else {
      //此处是正常的原生fetch请求 添加超时处理
      return new Promise((resolve, reject) => {
        var timeout = opts.timeout;
        if (timeout) {
          setTimeout(() => {
            reject(new Error("fetch timeout"));
          }, timeout);
        }
        oldFetchfn(input, opts)
          .then((res) => {
            return res.json();
          })
          .then(
            (res) => {
              resolve(res);
            },
            (err) => {
              reject(err);
            }
          );
      });
    }
  };
}
