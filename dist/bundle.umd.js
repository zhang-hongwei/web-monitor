(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var Config = {
    DEBUG: false,
    LIB_VERSION: '2.35.0'
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var platform = function () {
  function platform() {
    _classCallCheck(this, platform);

    this._platform = {};
    this.objectTypes = {
      function: true,
      object: true
    };

    this._root = this.objectTypes[typeof window === "undefined" ? "undefined" : _typeof(window)] && window || this;
    this.oldRoot = this.root;
    this.freeExports = this.objectTypes[typeof exports === "undefined" ? "undefined" : _typeof(exports)] && exports;
    this.freeModule = this.objectTypes[typeof module === "undefined" ? "undefined" : _typeof(module)] && module && !module.nodeType && module;
    this.freeGlobal = this.freeExports && this.freeModule && (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global;
    if (this.freeGlobal && (this.freeGlobal.global === this.freeGlobal || this.freeGlobal.window === this.freeGlobal || this.freeGlobal.self === this.freeGlobal)) {
      this.root = this.freeGlobal;
    }

    this.maxSafeInteger = Math.pow(2, 53) - 1;
    this.reOpera = /\bOpera/;
    this.thisBinding = this;
    this.objectProto = Object.prototype;
    this.hasOwnProperty = this.objectProto.hasOwnProperty;
    this.toString = this.objectProto.toString;

    this.init();
  }

  _createClass(platform, [{
    key: "capitalize",
    value: function capitalize(string) {
      string = String(string);
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }, {
    key: "cleanupOS",
    value: function cleanupOS(os, pattern, label) {
      var data = {
        "10.0": "10",
        "6.4": "10 Technical Preview",
        "6.3": "8.1",
        "6.2": "8",
        "6.1": "Server 2008 R2 / 7",
        "6.0": "Server 2008 / Vista",
        "5.2": "Server 2003 / XP 64-bit",
        "5.1": "XP",
        "5.01": "2000 SP1",
        "5.0": "2000",
        "4.0": "NT",
        "4.90": "ME"
      };
      // Detect Windows version from platform tokens.
      if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) && (data = data[/[\d.]+$/.exec(os)])) {
        os = "Windows " + data;
      }
      // Correct character case and cleanup string.
      os = String(os);

      if (pattern && label) {
        os = os.replace(RegExp(pattern, "i"), label);
      }

      os = this.format(os.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i, "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/, " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0]);

      return os;
    }
  }, {
    key: "each",
    value: function each(object, callback) {
      var index = -1,
          length = object ? object.length : 0;

      if (typeof length == "number" && length > -1 && length <= this.maxSafeInteger) {
        while (++index < length) {
          callback(object[index], index, object);
        }
      } else {
        this.forOwn(object, callback);
      }
    }
  }, {
    key: "format",
    value: function format(string) {
      string = this.trim(string);
      return (/^(?:webOS|i(?:OS|P))/.test(string) ? string : this.capitalize(string)
      );
    }
  }, {
    key: "forOwn",
    value: function forOwn(object, callback) {
      for (var key in object) {
        if (hasOwnProperty.call(object, key)) {
          callback(object[key], key, object);
        }
      }
    }
  }, {
    key: "getClassOf",
    value: function getClassOf(value) {
      return value == null ? this.capitalize(value) : toString.call(value).slice(8, -1);
    }
  }, {
    key: "isHostType",
    value: function isHostType(object, property) {
      var type = object != null ? _typeof(object[property]) : "number";
      return !/^(?:boolean|number|string|undefined)$/.test(type) && (type == "object" ? !!object[property] : true);
    }
  }, {
    key: "qualify",
    value: function qualify(string) {
      return String(string).replace(/([ -])(?!$)/g, "$1?");
    }
  }, {
    key: "reduce",
    value: function reduce(array, callback) {
      var accumulator = null;
      this.each(array, function (value, index) {
        accumulator = callback(accumulator, value, index, array);
      });
      return accumulator;
    }
  }, {
    key: "trim",
    value: function trim(string) {
      return String(string).replace(/^ +| +$/g, "");
    }
  }, {
    key: "parse",
    value: function parse(ua) {
      var _this = this;
      var context = this._root;
      var isCustomContext = ua && (typeof ua === "undefined" ? "undefined" : _typeof(ua)) == "object" && this.getClassOf(ua) != "String";

      if (isCustomContext) {
        context = ua;
        ua = null;
      }

      var nav = context.navigator || {};
      var userAgent = nav.userAgent || "";

      ua || (ua = userAgent);

      var isModuleScope = isCustomContext || this.thisBinding == this.oldRoot;

      var likeChrome = isCustomContext ? !!nav.likeChrome : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

      var objectClass = "Object",
          airRuntimeClass = isCustomContext ? objectClass : "ScriptBridgingProxyObject",
          enviroClass = isCustomContext ? objectClass : "Environment",
          javaClass = isCustomContext && context.java ? "JavaPackage" : this.getClassOf(context.java),
          phantomClass = isCustomContext ? objectClass : "RuntimeObject";

      var java = /\bJava/.test(javaClass) && context.java;
      var rhino = java && this.getClassOf(context.environment) == enviroClass;
      var alpha = java ? "a" : "\u03B1";
      var beta = java ? "b" : "\u03B2";
      var doc = context.document || {};
      var opera = context.operamini || context.opera;
      var operaClass = null;
      operaClass = this.reOpera.test(operaClass = isCustomContext && opera ? opera["[[Class]]"] : this.getClassOf(opera)) ? operaClass : opera = null;
      var data = void 0;
      var arch = ua;
      var description = [];
      var prerelease = null;
      var useFeatures = ua == userAgent;
      var version = useFeatures && opera && typeof opera.version == "function" && opera.version();
      var isSpecialCasedOS = void 0;

      var layout = getLayout.call(this, [{ label: "EdgeHTML", pattern: "(?:Edge|EdgA|EdgiOS)" }, "Trident", { label: "WebKit", pattern: "AppleWebKit" }, "iCab", "Presto", "NetFront", "Tasman", "KHTML", "Gecko"]);

      /* Detectable browser names (order is important). */
      var name = getName(["Adobe AIR", "Arora", "Avant Browser", "Breach", "Camino", "Electron", "Epiphany", "Fennec", "Flock", "Galeon", "GreenBrowser", "iCab", "Iceweasel", "K-Meleon", "Konqueror", "Lunascape", "Maxthon", { label: "Microsoft Edge", pattern: "(?:Edge|Edg|EdgA|EdgiOS)" }, "Midori", "Nook Browser", "PaleMoon", "PhantomJS", "Raven", "Rekonq", "RockMelt", { label: "Samsung Internet", pattern: "SamsungBrowser" }, "SeaMonkey", { label: "Silk", pattern: "(?:Cloud9|Silk-Accelerated)" }, "Sleipnir", "SlimBrowser", { label: "SRWare Iron", pattern: "Iron" }, "Sunrise", "Swiftfox", "Waterfox", "WebPositive", "Opera Mini", { label: "Opera Mini", pattern: "OPiOS" }, "Opera", { label: "Opera", pattern: "OPR" }, "Chrome", { label: "Chrome Mobile", pattern: "(?:CriOS|CrMo)" }, { label: "Firefox", pattern: "(?:Firefox|Minefield)" }, { label: "Firefox for iOS", pattern: "FxiOS" }, { label: "IE", pattern: "IEMobile" }, { label: "IE", pattern: "MSIE" }, "Safari"]);

      var product = getProduct([{ label: "BlackBerry", pattern: "BB10" }, "BlackBerry", { label: "Galaxy S", pattern: "GT-I9000" }, { label: "Galaxy S2", pattern: "GT-I9100" }, { label: "Galaxy S3", pattern: "GT-I9300" }, { label: "Galaxy S4", pattern: "GT-I9500" }, { label: "Galaxy S5", pattern: "SM-G900" }, { label: "Galaxy S6", pattern: "SM-G920" }, { label: "Galaxy S6 Edge", pattern: "SM-G925" }, { label: "Galaxy S7", pattern: "SM-G930" }, { label: "Galaxy S7 Edge", pattern: "SM-G935" }, "Google TV", "Lumia", "iPad", "iPod", "iPhone", "Kindle", { label: "Kindle Fire", pattern: "(?:Cloud9|Silk-Accelerated)" }, "Nexus", "Nook", "PlayBook", "PlayStation Vita", "PlayStation", "TouchPad", "Transformer", { label: "Wii U", pattern: "WiiU" }, "Wii", "Xbox One", { label: "Xbox 360", pattern: "Xbox" }, "Xoom"]);

      var manufacturer = getManufacturer({
        Apple: { iPad: 1, iPhone: 1, iPod: 1 },
        Archos: {},
        Amazon: { Kindle: 1, "Kindle Fire": 1 },
        Asus: { Transformer: 1 },
        "Barnes & Noble": { Nook: 1 },
        BlackBerry: { PlayBook: 1 },
        Google: { "Google TV": 1, Nexus: 1 },
        HP: { TouchPad: 1 },
        HTC: {},
        LG: {},
        Microsoft: { Xbox: 1, "Xbox One": 1 },
        Motorola: { Xoom: 1 },
        Nintendo: { "Wii U": 1, Wii: 1 },
        Nokia: { Lumia: 1 },
        Samsung: {
          "Galaxy S": 1,
          "Galaxy S2": 1,
          "Galaxy S3": 1,
          "Galaxy S4": 1
        },
        Sony: { PlayStation: 1, "PlayStation Vita": 1 }
      });

      /* Detectable operating systems (order is important). */
      var os = getOS(["Windows Phone", "Android", "CentOS", { label: "Chrome OS", pattern: "CrOS" }, "Debian", "Fedora", "FreeBSD", "Gentoo", "Haiku", "Kubuntu", "Linux Mint", "OpenBSD", "Red Hat", "SuSE", "Ubuntu", "Xubuntu", "Cygwin", "Symbian OS", "hpwOS", "webOS ", "webOS", "Tablet OS", "Tizen", "Linux", "Mac OS X", "Macintosh", "Mac", "Windows 98;", "Windows "]);

      function getLayout(guesses) {
        return _this.reduce(guesses, function (result, guess) {
          return result || RegExp("\\b" + (guess.pattern || _this.qualify(guess)) + "\\b", "i").exec(ua) && (guess.label || guess);
        });
      }

      function getManufacturer(guesses) {
        return _this.reduce(guesses, function (result, value, key) {
          // Lookup the manufacturer by product or scan the UA for the manufacturer.
          return result || (value[product] || value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] || RegExp("\\b" + _this.qualify(key) + "(?:\\b|\\w*\\d)", "i").exec(ua)) && key;
        });
      }

      function getName(guesses) {
        return _this.reduce(guesses, function (result, guess) {
          return result || RegExp("\\b" + (guess.pattern || _this.qualify(guess)) + "\\b", "i").exec(ua) && (guess.label || guess);
        });
      }

      function getOS(guesses) {
        return _this.reduce(guesses, function (result, guess) {
          var pattern = guess.pattern || _this.qualify(guess);
          if (!result && (result = RegExp("\\b" + pattern + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(ua))) {
            result = _this.cleanupOS(result, pattern, guess.label || guess);
          }
          return result;
        });
      }

      function getProduct(guesses) {
        return _this.reduce(guesses, function (result, guess) {
          var pattern = guess.pattern || _this.qualify(guess);
          if (!result && (result = RegExp("\\b" + pattern + " *\\d+[.\\w_]*", "i").exec(ua) || RegExp("\\b" + pattern + " *\\w+-[\\w]*", "i").exec(ua) || RegExp("\\b" + pattern + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)", "i").exec(ua))) {
            // Split by forward slash and append product version if needed.
            if ((result = String(guess.label && !RegExp(pattern, "i").test(guess.label) ? guess.label : result).split("/"))[1] && !/[\d.]+/.test(result[0])) {
              result[0] += " " + result[1];
            }
            // Correct character case and cleanup string.
            guess = guess.label || guess;
            result = _this.format(result[0].replace(RegExp(pattern, "i"), guess).replace(RegExp("; *(?:" + guess + "[_-])?", "i"), " ").replace(RegExp("(" + guess + ")[-_.]?(\\w)", "i"), "$1 $2"));
          }
          return result;
        });
      }

      function getVersion(patterns) {
        return _this.reduce(patterns, function (result, pattern) {
          return result || (RegExp(pattern + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)", "i").exec(ua) || 0)[1] || null;
        });
      }

      function toStringPlatform() {
        return _this.description || "";
      }

      layout && (layout = [layout]);

      if (manufacturer && !product) {
        product = getProduct([manufacturer]);
      }

      if (data = /\bGoogle TV\b/.exec(product)) {
        product = data[0];
      }

      if (/\bSimulator\b/i.test(ua)) {
        product = (product ? product + " " : "") + "Simulator";
      }

      if (name == "Opera Mini" && /\bOPiOS\b/.test(ua)) {
        description.push("running in Turbo/Uncompressed mode");
      }

      if (name == "IE" && /\blike iPhone OS\b/.test(ua)) {
        data = this.parse(ua.replace(/like iPhone OS/, ""));
        manufacturer = data.manufacturer;
        product = data.product;
      } else if (/^iP/.test(product)) {
        name || (name = "Safari");
        os = "iOS" + ((data = / OS ([\d_]+)/i.exec(ua)) ? " " + data[1].replace(/_/g, ".") : "");
      }
      // Detect Kubuntu.
      else if (name == "Konqueror" && !/buntu/i.test(os)) {
          os = "Kubuntu";
        }
        // Detect Android browsers.
        else if (manufacturer && manufacturer != "Google" && (/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua) || /\bVita\b/.test(product)) || /\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua)) {
            name = "Android Browser";
            os = /\bAndroid\b/.test(os) ? os : "Android";
          }
          // Detect Silk desktop/accelerated modes.
          else if (name == "Silk") {
              if (!/\bMobi/i.test(ua)) {
                os = "Android";
                description.unshift("desktop mode");
              }
              if (/Accelerated *= *true/i.test(ua)) {
                description.unshift("accelerated");
              }
            }
            // Detect PaleMoon identifying as Firefox.
            else if (name == "PaleMoon" && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
                description.push("identifying as Firefox " + data[1]);
              }
              // Detect Firefox OS and products running Firefox.
              else if (name == "Firefox" && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
                  os || (os = "Firefox OS");
                  product || (product = data[1]);
                }
                // Detect false positives for Firefox/Safari.
                else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
                    // Escape the `/` for Firefox 1.
                    if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + "/") + 8))) {
                      // Clear name of false positives.
                      name = null;
                    }
                    // Reassign a generic name.
                    if ((data = product || manufacturer || os) && (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
                      name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + " Browser";
                    }
                  }
                  // Add Chrome version to description for Electron.
                  else if (name == "Electron" && (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])) {
                      description.push("Chromium " + data);
                    }
      // Detect non-Opera (Presto-based) versions (order is important).
      if (!version) {
        version = getVersion(["(?:Cloud9|CriOS|CrMo|Edge|Edg|EdgA|EdgiOS|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))", "Version", _this.qualify(name), "(?:Firefox|Minefield|NetFront)"]);
      }
      // Detect stubborn layout engines.
      if (data = layout == "iCab" && parseFloat(version) > 3 && "WebKit" || /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? "Blink" : "Presto") || /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && "WebKit" || !layout && /\bMSIE\b/i.test(ua) && (os == "Mac OS" ? "Tasman" : "Trident") || layout == "WebKit" && /\bPlayStation\b(?! Vita\b)/i.test(name) && "NetFront") {
        layout = [data];
      }
      // Detect Windows Phone 7 desktop mode.
      if (name == "IE" && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
        name += " Mobile";
        os = "Windows Phone " + (/\+$/.test(data) ? data : data + ".x");
        description.unshift("desktop mode");
      }
      // Detect Windows Phone 8.x desktop mode.
      else if (/\bWPDesktop\b/i.test(ua)) {
          name = "IE Mobile";
          os = "Windows Phone 8.x";
          description.unshift("desktop mode");
          version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
        }
        // Detect IE 11 identifying as other browsers.
        else if (name != "IE" && layout == "Trident" && (data = /\brv:([\d.]+)/.exec(ua))) {
            if (name) {
              description.push("identifying as " + name + (version ? " " + version : ""));
            }
            name = "IE";
            version = data[1];
          }
      // Leverage environment features.
      if (useFeatures) {
        if (this.isHostType(context, "global")) {
          if (java) {
            data = java.lang.System;
            arch = data.getProperty("os.arch");
            os = os || data.getProperty("os.name") + " " + data.getProperty("os.version");
          }
          if (rhino) {
            try {
              version = context.require("ringo/engine").version.join(".");
              name = "RingoJS";
            } catch (e) {
              if ((data = context.system) && data.global.system == context.system) {
                name = "Narwhal";
                os || (os = data[0].os || null);
              }
            }
            if (!name) {
              name = "Rhino";
            }
          } else if (_typeof(context.process) == "object" && !context.process.browser && (data = context.process)) {
            if (_typeof(data.versions) == "object") {
              if (typeof data.versions.electron == "string") {
                description.push("Node " + data.versions.node);
                name = "Electron";
                version = data.versions.electron;
              } else if (typeof data.versions.nw == "string") {
                description.push("Chromium " + version, "Node " + data.versions.node);
                name = "NW.js";
                version = data.versions.nw;
              }
            }
            if (!name) {
              name = "Node.js";
              arch = data.arch;
              os = data.platform;
              version = /[\d.]+/.exec(data.version);
              version = version ? version[0] : null;
            }
          }
        }
        // Detect Adobe AIR.
        else if (this.getClassOf(data = context.runtime) == airRuntimeClass) {
            name = "Adobe AIR";
            os = data.flash.system.Capabilities.os;
          }
          // Detect PhantomJS.
          else if (this.getClassOf(data = context.phantom) == phantomClass) {
              name = "PhantomJS";
              version = (data = data.version || null) && data.major + "." + data.minor + "." + data.patch;
            }
            // Detect IE compatibility modes.
            else if (typeof doc.documentMode == "number" && (data = /\bTrident\/(\d+)/i.exec(ua))) {
                // We're in compatibility mode when the Trident version + 4 doesn't
                // equal the document mode.
                version = [version, doc.documentMode];
                if ((data = +data[1] + 4) != version[1]) {
                  description.push("IE " + version[1] + " mode");
                  layout && (layout[1] = "");
                  version[1] = data;
                }
                version = name == "IE" ? String(version[1].toFixed(1)) : version[0];
              }
              // Detect IE 11 masking as other browsers.
              else if (typeof doc.documentMode == "number" && /^(?:Chrome|Firefox)\b/.test(name)) {
                  description.push("masking as " + name + " " + version);
                  name = "IE";
                  version = "11.0";
                  layout = ["Trident"];
                  os = "Windows";
                }
        os = os && this.format(os);
      }
      // Detect prerelease phases.
      if (version && (data = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) || /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ";" + (useFeatures && nav.appMinorVersion)) || /\bMinefield\b/i.test(ua) && "a")) {
        prerelease = /b/i.test(data) ? "beta" : "alpha";
        version = version.replace(RegExp(data + "\\+?$"), "") + (prerelease == "beta" ? beta : alpha) + (/\d+\+?/.exec(data) || "");
      }
      // Detect Firefox Mobile.
      if (name == "Fennec" || name == "Firefox" && /\b(?:Android|Firefox OS)\b/.test(os)) {
        name = "Firefox Mobile";
      }
      // Obscure Maxthon's unreliable version.
      else if (name == "Maxthon" && version) {
          version = version.replace(/\.[\d.]+/, ".x");
        }
        // Detect Xbox 360 and Xbox One.
        else if (/\bXbox\b/i.test(product)) {
            if (product == "Xbox 360") {
              os = null;
            }
            if (product == "Xbox 360" && /\bIEMobile\b/.test(ua)) {
              description.unshift("mobile mode");
            }
          }
          // Add mobile postfix.
          else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) && (os == "Windows CE" || /Mobi/i.test(ua))) {
              name += " Mobile";
            }
            // Detect IE platform preview.
            else if (name == "IE" && useFeatures) {
                try {
                  if (context.external === null) {
                    description.unshift("platform preview");
                  }
                } catch (e) {
                  description.unshift("embedded");
                }
              } else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data = (RegExp(product.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(ua) || 0)[1] || version)) {
                data = [data, /BB10/.test(ua)];
                os = (data[1] ? (product = null, manufacturer = "BlackBerry") : "Device Software") + " " + data[0];
                version = null;
              } else if (this != this.forOwn && product != "Wii" && (useFeatures && opera || /Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua) || name == "Firefox" && /\bOS X (?:\d+\.){2,}/.test(os) || name == "IE" && (os && !/^Win/.test(os) && version > 5.5 || /\bWindows XP\b/.test(os) && version > 8 || version == 8 && !/\bTrident\b/.test(ua))) && !this.reOpera.test(data = this.parse.call(this.forOwn, ua.replace(this.reOpera, "") + ";")) && data.name) {
                // When "identifying", the UA contains both Opera and the other browser's name.
                data = "ing as " + data.name + ((data = data.version) ? " " + data : "");
                if (this.reOpera.test(name)) {
                  if (/\bIE\b/.test(data) && os == "Mac OS") {
                    os = null;
                  }
                  data = "identify" + data;
                }
                // When "masking", the UA contains only the other browser's name.
                else {
                    data = "mask" + data;
                    if (operaClass) {
                      name = this.format(operaClass.replace(/([a-z])([A-Z])/g, "$1 $2"));
                    } else {
                      name = "Opera";
                    }
                    if (/\bIE\b/.test(data)) {
                      os = null;
                    }
                    if (!useFeatures) {
                      version = null;
                    }
                  }
                layout = ["Presto"];
                description.push(data);
              }

      if (data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1]) {
        data = [parseFloat(data.replace(/\.(\d)$/, ".0$1")), data];
        // Nightly builds are postfixed with a "+".
        if (name == "Safari" && data[1].slice(-1) == "+") {
          name = "WebKit Nightly";
          prerelease = "alpha";
          version = data[1].slice(0, -1);
        } else if (version == data[1] || version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
          version = null;
        }

        data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];

        if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == "WebKit") {
          layout = ["Blink"];
        }

        if (!useFeatures || !likeChrome && !data[1]) {
          layout && (layout[1] = "like Safari");
          data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? "4+" : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : "8");
        } else {
          layout && (layout[1] = "like Chrome");
          data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.1 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.3 ? 11 : data < 535.01 ? 12 : data < 535.02 ? "13+" : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.1 ? 19 : data < 537.01 ? 20 : data < 537.11 ? "21+" : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != "Blink" ? "27" : "28");
        }
        // Add the postfix of ".x" or "+" for approximate versions.
        layout && (layout[1] += " " + (data += typeof data == "number" ? ".x" : /[.+]/.test(data) ? "" : "+"));
        // Obscure version for some Safari 1-2 releases.
        if (name == "Safari" && (!version || parseInt(version) > 45)) {
          version = data;
        }
      }
      // Detect Opera desktop modes.
      if (name == "Opera" && (data = /\bzbov|zvav$/.exec(os))) {
        name += " ";
        description.unshift("desktop mode");
        if (data == "zvav") {
          name += "Mini";
          version = null;
        } else {
          name += "Mobile";
        }
        os = os.replace(RegExp(" *" + data + "$"), "");
      }
      // Detect Chrome desktop mode.
      else if (name == "Safari" && /\bChrome\b/.exec(layout && layout[1])) {
          description.unshift("desktop mode");
          name = "Chrome Mobile";
          version = null;

          if (/\bOS X\b/.test(os)) {
            manufacturer = "Apple";
            os = "iOS 4.3+";
          } else {
            os = null;
          }
        }
      // Strip incorrect OS versions.
      if (version && version.indexOf(data = /[\d.]+$/.exec(os)) == 0 && ua.indexOf("/" + data + "-") > -1) {
        os = this.trim(os.replace(data, ""));
      }
      // Add layout engine.
      if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (/Browser|Lunascape|Maxthon/.test(name) || name != "Safari" && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(name) && layout[1])) {
        (data = layout[layout.length - 1]) && description.push(data);
      }
      if (description.length) {
        description = ["(" + description.join("; ") + ")"];
      }
      if (manufacturer && product && product.indexOf(manufacturer) < 0) {
        description.push("on " + manufacturer);
      }
      if (product) {
        description.push((/^on /.test(description[description.length - 1]) ? "" : "on ") + product);
      }
      // Parse the OS into an object.
      if (os) {
        data = / ([\d.+]+)$/.exec(os);
        isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == "/";
        os = {
          architecture: 32,
          family: data && !isSpecialCasedOS ? os.replace(data[0], "") : os,
          version: data ? data[1] : null,
          toString: function toString() {
            var version = this.version;
            return this.family + (version && !isSpecialCasedOS ? " " + version : "") + (this.architecture == 64 ? " 64-bit" : "");
          }
        };
      }

      if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
        if (os) {
          os.architecture = 64;
          os.family = os.family.replace(RegExp(" *" + data), "");
        }
        if (name && (/\bWOW64\b/i.test(ua) || useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua))) {
          description.unshift("32-bit");
        }
      } else if (os && /^OS X/.test(os.family) && name == "Chrome" && parseFloat(version) >= 39) {
        os.architecture = 64;
      }

      ua || (ua = null);
      this._platform.description = ua;
      this._platform.layout = layout && layout[0];
      this._platform.manufacturer = manufacturer;
      this._platform.name = name;
      this._platform.prerelease = prerelease;
      this._platform.product = product;
      this._platform.ua = ua;
      this._platform.version = name && version;
      this._platform.os = os || {
        architecture: null,
        family: null,
        version: null,
        toString: function toString() {
          return "null";
        }
      };

      this._platform.parse = this.parse;
      this._platform.toString = toStringPlatform;

      if (this._platform.version) {
        description.unshift(version);
      }
      if (this._platform.name) {
        description.unshift(name);
      }
      if (os && name && !(os == String(os).split(" ")[0] && (os == name.split(" ")[0] || product))) {
        description.push(product ? "(" + os + ")" : "on " + os);
      }
      if (description.length) {
        this._platform.description = description.join(" ");
      }
      return this._platform;
    }
  }, {
    key: "init",
    value: function init() {
      this._platform = this.parse();
      if (typeof define == "function" && _typeof(define.amd) == "object" && define.amd) {
        this.root.platform = this._platform;
        define(function () {
          return this._platform;
        });
      } else if (this.freeExports && this.freeModule) {
        this.forOwn(this._platform, function (value, key) {
          this.freeExports[key] = value;
        });
      } else {
        this._root.platform = this._platform;
      }
    }
  }]);

  return platform;
}();



// const os = new platform();
// console.log("os===>", os._platform);

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint camelcase: "off", eqeqeq: "off" */
var win;
if (typeof window === "undefined") {
  var loc = {
    hostname: ""
  };
  win = {
    navigator: { userAgent: "" },
    document: {
      location: loc,
      referrer: ""
    },
    screen: { width: 0, height: 0 },
    location: loc
  };
} else {
  win = window;
}

/*
 * Saved references to long variable names, so that closure compiler can
 * minimize file size.
 */

var ArrayProto = Array.prototype;
var FuncProto = Function.prototype;
var ObjProto = Object.prototype;
var slice = ArrayProto.slice;
var toString$1 = ObjProto.toString;
var hasOwnProperty$1 = ObjProto.hasOwnProperty;
var windowConsole = win.console;
var navigator = win.navigator;
var document$1 = win.document;
var windowOpera = win.opera;
var screen = win.screen;
var userAgent = navigator.userAgent;

var nativeBind = FuncProto.bind;
var nativeForEach = ArrayProto.forEach;
var nativeIndexOf = ArrayProto.indexOf;
var nativeIsArray = Array.isArray;
var breaker = {};

var _ = {
  trim: function trim(str) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  }
};

// Console override
var console$1 = {
  /** @type {function(...*)} */
  log: function log() {
    if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
      try {
        windowConsole.log.apply(windowConsole, arguments);
      } catch (err) {
        _.each(arguments, function (arg) {
          windowConsole.log(arg);
        });
      }
    }
  },
  /** @type {function(...*)} */
  error: function error() {
    if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
      var args = ["Mixpanel error:"].concat(_.toArray(arguments));
      try {
        windowConsole.error.apply(windowConsole, args);
      } catch (err) {
        _.each(args, function (arg) {
          windowConsole.error(arg);
        });
      }
    }
  },
  /** @type {function(...*)} */
  critical: function critical() {
    if (!_.isUndefined(windowConsole) && windowConsole) {
      var args = ["Mixpanel error:"].concat(_.toArray(arguments));
      try {
        windowConsole.error.apply(windowConsole, args);
      } catch (err) {
        _.each(args, function (arg) {
          windowConsole.error(arg);
        });
      }
    }
  }
};

// UNDERSCORE
// Embed part of the Underscore Library
_.bind = function (func, context) {
  var args, _bound;
  if (nativeBind && func.bind === nativeBind) {
    return nativeBind.apply(func, slice.call(arguments, 1));
  }
  if (!_.isFunction(func)) {
    throw new TypeError();
  }
  args = slice.call(arguments, 2);
  _bound = function bound() {
    if (!(this instanceof _bound)) {
      return func.apply(context, args.concat(slice.call(arguments)));
    }
    var ctor = {};
    ctor.prototype = func.prototype;
    var self = new ctor();
    ctor.prototype = null;
    var result = func.apply(self, args.concat(slice.call(arguments)));
    if (Object(result) === result) {
      return result;
    }
    return self;
  };
  return _bound;
};

_.bind_instance_methods = function (obj) {
  for (var func in obj) {
    if (typeof obj[func] === "function") {
      obj[func] = _.bind(obj[func], obj);
    }
  }
};

/**
 * @param {*=} obj
 * @param {function(...*)=} iterator
 * @param {Object=} context
 */
_.each = function (obj, iterator, context) {
  if (obj === null || obj === undefined) {
    return;
  }
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
        return;
      }
    }
  } else {
    for (var key in obj) {
      if (hasOwnProperty$1.call(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === breaker) {
          return;
        }
      }
    }
  }
};

_.escapeHTML = function (s) {
  var escaped = s;
  if (escaped && _.isString(escaped)) {
    escaped = escaped.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  return escaped;
};

_.extend = function (obj) {
  _.each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

_.isArray = nativeIsArray || function (obj) {
  return toString$1.call(obj) === "[object Array]";
};

// from a comment on http://dbj.org/dbj/?p=286
// fails on only one very rare and deliberate custom object:
// var bomb = { toString : undefined, valueOf: function(o) { return "function BOMBA!"; }};
_.isFunction = function (f) {
  try {
    return (/^\s*\bfunction\b/.test(f)
    );
  } catch (x) {
    return false;
  }
};

_.isArguments = function (obj) {
  return !!(obj && hasOwnProperty$1.call(obj, "callee"));
};

_.toArray = function (iterable) {
  if (!iterable) {
    return [];
  }
  if (iterable.toArray) {
    return iterable.toArray();
  }
  if (_.isArray(iterable)) {
    return slice.call(iterable);
  }
  if (_.isArguments(iterable)) {
    return slice.call(iterable);
  }
  return _.values(iterable);
};

_.keys = function (obj) {
  var results = [];
  if (obj === null) {
    return results;
  }
  _.each(obj, function (value, key) {
    results[results.length] = key;
  });
  return results;
};

_.values = function (obj) {
  var results = [];
  if (obj === null) {
    return results;
  }
  _.each(obj, function (value) {
    results[results.length] = value;
  });
  return results;
};

_.identity = function (value) {
  return value;
};

_.include = function (obj, target) {
  var found = false;
  if (obj === null) {
    return found;
  }
  if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
    return obj.indexOf(target) != -1;
  }
  _.each(obj, function (value) {
    if (found || (found = value === target)) {
      return breaker;
    }
  });
  return found;
};

_.includes = function (str, needle) {
  return str.indexOf(needle) !== -1;
};

// Underscore Addons
_.inherit = function (subclass, superclass) {
  subclass.prototype = new superclass();
  subclass.prototype.constructor = subclass;
  subclass.superclass = superclass.prototype;
  return subclass;
};

_.isObject = function (obj) {
  return obj === Object(obj) && !_.isArray(obj);
};

_.isEmptyObject = function (obj) {
  if (_.isObject(obj)) {
    for (var key in obj) {
      if (hasOwnProperty$1.call(obj, key)) {
        return false;
      }
    }
    return true;
  }
  return false;
};

_.isUndefined = function (obj) {
  return obj === void 0;
};

_.isString = function (obj) {
  return toString$1.call(obj) == "[object String]";
};

_.isDate = function (obj) {
  return toString$1.call(obj) == "[object Date]";
};

_.isNumber = function (obj) {
  return toString$1.call(obj) == "[object Number]";
};

_.isElement = function (obj) {
  return !!(obj && obj.nodeType === 1);
};

_.encodeDates = function (obj) {
  _.each(obj, function (v, k) {
    if (_.isDate(v)) {
      obj[k] = _.formatDate(v);
    } else if (_.isObject(v)) {
      obj[k] = _.encodeDates(v); // recurse
    }
  });
  return obj;
};

_.timestamp = function () {
  Date.now = Date.now || function () {
    return +new Date();
  };
  return Date.now();
};

_.formatDate = function (d) {
  // YYYY-MM-DDTHH:MM:SS in UTC
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds());
};

_.safewrap = function (f) {
  return function () {
    try {
      return f.apply(this, arguments);
    } catch (e) {
      console$1.critical("Implementation error. Please turn on debug and contact support@mixpanel.com.");
      if (Config.DEBUG) {
        console$1.critical(e);
      }
    }
  };
};

_.safewrap_class = function (klass, functions) {
  for (var i = 0; i < functions.length; i++) {
    klass.prototype[functions[i]] = _.safewrap(klass.prototype[functions[i]]);
  }
};

_.safewrap_instance_methods = function (obj) {
  for (var func in obj) {
    if (typeof obj[func] === "function") {
      obj[func] = _.safewrap(obj[func]);
    }
  }
};

_.strip_empty_properties = function (p) {
  var ret = {};
  _.each(p, function (v, k) {
    if (_.isString(v) && v.length > 0) {
      ret[k] = v;
    }
  });
  return ret;
};

/*
 * this function returns a copy of object after truncating it.  If
 * passed an Array or Object it will iterate through obj and
 * truncate all the values recursively.
 */
_.truncate = function (obj, length) {
  var ret;

  if (typeof obj === "string") {
    ret = obj.slice(0, length);
  } else if (_.isArray(obj)) {
    ret = [];
    _.each(obj, function (val) {
      ret.push(_.truncate(val, length));
    });
  } else if (_.isObject(obj)) {
    ret = {};
    _.each(obj, function (val, key) {
      ret[key] = _.truncate(val, length);
    });
  } else {
    ret = obj;
  }

  return ret;
};

_.JSONEncode = function () {
  return function (mixed_val) {
    var value = mixed_val;
    var quote = function quote(string) {
      var escapable = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g; // eslint-disable-line no-control-regex
      var meta = {
        // table of character substitutions
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
      };

      escapable.lastIndex = 0;
      return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
        var c = meta[a];
        return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
      }) + '"' : '"' + string + '"';
    };

    var str = function str(key, holder) {
      var gap = "";
      var indent = "    ";
      var i = 0; // The loop counter.
      var k = ""; // The member key.
      var v = ""; // The member value.
      var length = 0;
      var mind = gap;
      var partial = [];
      var value = holder[key];

      // If the value has a toJSON method, call it to obtain a replacement value.
      if (value && (typeof value === "undefined" ? "undefined" : _typeof$1(value)) === "object" && typeof value.toJSON === "function") {
        value = value.toJSON(key);
      }

      // What happens next depends on the value's type.
      switch (typeof value === "undefined" ? "undefined" : _typeof$1(value)) {
        case "string":
          return quote(value);

        case "number":
          // JSON numbers must be finite. Encode non-finite numbers as null.
          return isFinite(value) ? String(value) : "null";

        case "boolean":
        case "null":
          // If the value is a boolean or null, convert it to a string. Note:
          // typeof null does not produce 'null'. The case is included here in
          // the remote chance that this gets fixed someday.

          return String(value);

        case "object":
          // If the type is 'object', we might be dealing with an object or an array or
          // null.
          // Due to a specification blunder in ECMAScript, typeof null is 'object',
          // so watch out for that case.
          if (!value) {
            return "null";
          }

          // Make an array to hold the partial results of stringifying this object value.
          gap += indent;
          partial = [];

          // Is the value an array?
          if (toString$1.apply(value) === "[object Array]") {
            // The value is an array. Stringify every element. Use null as a placeholder
            // for non-JSON values.

            length = value.length;
            for (i = 0; i < length; i += 1) {
              partial[i] = str(i, value) || "null";
            }

            // Join all of the elements together, separated with commas, and wrap them in
            // brackets.
            v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
            gap = mind;
            return v;
          }

          // Iterate through all of the keys in the object.
          for (k in value) {
            if (hasOwnProperty$1.call(value, k)) {
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ": " : ":") + v);
              }
            }
          }

          // Join all of the member texts together, separated with commas,
          // and wrap them in braces.
          v = partial.length === 0 ? "{}" : gap ? "{" + partial.join(",") + "" + mind + "}" : "{" + partial.join(",") + "}";
          gap = mind;
          return v;
      }
    };

    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.
    return str("", {
      "": value
    });
  };
}();

/**
 * From https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
 * Slightly modified to throw a real Error rather than a POJO
 */
_.JSONDecode = function () {
  var at,
      // The index of the current character
  ch,
      // The current character
  escapee = {
    '"': '"',
    "\\": "\\",
    "/": "/",
    b: "\b",
    f: "\f",
    n: "\n",
    r: "\r",
    t: "\t"
  },
      text,
      error = function error(m) {
    var e = new SyntaxError(m);
    e.at = at;
    e.text = text;
    throw e;
  },
      next = function next(c) {
    // If a c parameter is provided, verify that it matches the current character.
    if (c && c !== ch) {
      error("Expected '" + c + "' instead of '" + ch + "'");
    }
    // Get the next character. When there are no more characters,
    // return the empty string.
    ch = text.charAt(at);
    at += 1;
    return ch;
  },
      number = function number() {
    // Parse a number value.
    var number,
        string = "";

    if (ch === "-") {
      string = "-";
      next("-");
    }
    while (ch >= "0" && ch <= "9") {
      string += ch;
      next();
    }
    if (ch === ".") {
      string += ".";
      while (next() && ch >= "0" && ch <= "9") {
        string += ch;
      }
    }
    if (ch === "e" || ch === "E") {
      string += ch;
      next();
      if (ch === "-" || ch === "+") {
        string += ch;
        next();
      }
      while (ch >= "0" && ch <= "9") {
        string += ch;
        next();
      }
    }
    number = +string;
    if (!isFinite(number)) {
      error("Bad number");
    } else {
      return number;
    }
  },
      string = function string() {
    // Parse a string value.
    var hex,
        i,
        string = "",
        uffff;
    // When parsing for string values, we must look for " and \ characters.
    if (ch === '"') {
      while (next()) {
        if (ch === '"') {
          next();
          return string;
        }
        if (ch === "\\") {
          next();
          if (ch === "u") {
            uffff = 0;
            for (i = 0; i < 4; i += 1) {
              hex = parseInt(next(), 16);
              if (!isFinite(hex)) {
                break;
              }
              uffff = uffff * 16 + hex;
            }
            string += String.fromCharCode(uffff);
          } else if (typeof escapee[ch] === "string") {
            string += escapee[ch];
          } else {
            break;
          }
        } else {
          string += ch;
        }
      }
    }
    error("Bad string");
  },
      white = function white() {
    // Skip whitespace.
    while (ch && ch <= " ") {
      next();
    }
  },
      word = function word() {
    // true, false, or null.
    switch (ch) {
      case "t":
        next("t");
        next("r");
        next("u");
        next("e");
        return true;
      case "f":
        next("f");
        next("a");
        next("l");
        next("s");
        next("e");
        return false;
      case "n":
        next("n");
        next("u");
        next("l");
        next("l");
        return null;
    }
    error('Unexpected "' + ch + '"');
  },
      value,
      // Placeholder for the value function.
  array = function array() {
    // Parse an array value.
    var array = [];

    if (ch === "[") {
      next("[");
      white();
      if (ch === "]") {
        next("]");
        return array; // empty array
      }
      while (ch) {
        array.push(value());
        white();
        if (ch === "]") {
          next("]");
          return array;
        }
        next(",");
        white();
      }
    }
    error("Bad array");
  },
      object = function object() {
    // Parse an object value.
    var key,
        object = {};

    if (ch === "{") {
      next("{");
      white();
      if (ch === "}") {
        next("}");
        return object; // empty object
      }
      while (ch) {
        key = string();
        white();
        next(":");
        if (Object.hasOwnProperty.call(object, key)) {
          error('Duplicate key "' + key + '"');
        }
        object[key] = value();
        white();
        if (ch === "}") {
          next("}");
          return object;
        }
        next(",");
        white();
      }
    }
    error("Bad object");
  };

  value = function value() {
    // Parse a JSON value. It could be an object, an array, a string,
    // a number, or a word.
    white();
    switch (ch) {
      case "{":
        return object();
      case "[":
        return array();
      case '"':
        return string();
      case "-":
        return number();
      default:
        return ch >= "0" && ch <= "9" ? number() : word();
    }
  };

  // Return the json_parse function. It will have access to all of the
  // above functions and variables.
  return function (source) {
    var result;

    text = source;
    at = 0;
    ch = " ";
    result = value();
    white();
    if (ch) {
      error("Syntax error");
    }

    return result;
  };
}();

_.base64Encode = function (data) {
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1,
      o2,
      o3,
      h1,
      h2,
      h3,
      h4,
      bits,
      i = 0,
      ac = 0,
      enc = "",
      tmp_arr = [];

  if (!data) {
    return data;
  }

  data = _.utf8Encode(data);

  do {
    // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join("");

  switch (data.length % 3) {
    case 1:
      enc = enc.slice(0, -2) + "==";
      break;
    case 2:
      enc = enc.slice(0, -1) + "=";
      break;
  }

  return enc;
};

_.utf8Encode = function (string) {
  string = (string + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  var utftext = "",
      start,
      end;
  var stringl = 0,
      n;

  start = end = 0;
  stringl = string.length;

  for (n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n);
    var enc = null;

    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(c1 >> 6 | 192, c1 & 63 | 128);
    } else {
      enc = String.fromCharCode(c1 >> 12 | 224, c1 >> 6 & 63 | 128, c1 & 63 | 128);
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.substring(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.substring(start, string.length);
  }

  return utftext;
};

_.UUID = function () {
  // Time/ticks information
  // 1*new Date() is a cross browser version of Date.now()
  var T = function T() {
    var d = 1 * new Date(),
        i = 0;

    // this while loop figures how many browser ticks go by
    // before 1*new Date() returns a new number, ie the amount
    // of ticks that go by per millisecond
    while (d == 1 * new Date()) {
      i++;
    }

    return d.toString(16) + i.toString(16);
  };

  // Math.Random entropy
  var R = function R() {
    return Math.random().toString(16).replace(".", "");
  };

  // User agent entropy
  // This function takes the user agent string, and then xors
  // together each sequence of 8 bytes.  This produces a final
  // sequence of 8 bytes which it returns as hex.
  var UA = function UA() {
    var ua = userAgent,
        i,
        ch,
        buffer = [],
        ret = 0;

    function xor(result, byte_array) {
      var j,
          tmp = 0;
      for (j = 0; j < byte_array.length; j++) {
        tmp |= buffer[j] << j * 8;
      }
      return result ^ tmp;
    }

    for (i = 0; i < ua.length; i++) {
      ch = ua.charCodeAt(i);
      buffer.unshift(ch & 0xff);
      if (buffer.length >= 4) {
        ret = xor(ret, buffer);
        buffer = [];
      }
    }

    if (buffer.length > 0) {
      ret = xor(ret, buffer);
    }

    return ret.toString(16);
  };

  return function () {
    var se = (screen.height * screen.width).toString(16);
    return T() + "-" + R() + "-" + UA() + "-" + se + "-" + T();
  };
}();

// _.isBlockedUA()
// This is to block various web spiders from executing our JS and
// sending false tracking data
_.isBlockedUA = function (ua) {
  if (/(google web preview|baiduspider|yandexbot|bingbot|googlebot|yahoo! slurp)/i.test(ua)) {
    return true;
  }
  return false;
};

/**
 * @param {Object=} formdata
 * @param {string=} arg_separator
 */
_.HTTPBuildQuery = function (formdata, arg_separator) {
  var use_val,
      use_key,
      tmp_arr = [];

  if (_.isUndefined(arg_separator)) {
    arg_separator = "&";
  }

  _.each(formdata, function (val, key) {
    use_val = encodeURIComponent(val.toString());
    use_key = encodeURIComponent(key);
    tmp_arr[tmp_arr.length] = use_key + "=" + use_val;
  });

  return tmp_arr.join(arg_separator);
};

_.getQueryParam = function (url, param) {
  // Expects a raw URL

  param = param.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
  var regexS = "[\\?&]" + param + "=([^&#]*)",
      regex = new RegExp(regexS),
      results = regex.exec(url);
  if (results === null || results && typeof results[1] !== "string" && results[1].length) {
    return "";
  } else {
    var result = results[1];
    try {
      result = decodeURIComponent(result);
    } catch (err) {
      console$1.error("Skipping decoding for malformed query param: " + result);
    }
    return result.replace(/\+/g, " ");
  }
};

_.getHashParam = function (hash, param) {
  var matches = hash.match(new RegExp(param + "=([^&]*)"));
  return matches ? matches[1] : null;
};

// _.cookie
// Methods partially borrowed from quirksmode.org/js/cookies.html
_.cookie = {
  get: function get(name) {
    var nameEQ = name + "=";
    var ca = document$1.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  },

  parse: function parse(name) {
    var cookie;
    try {
      cookie = _.JSONDecode(_.cookie.get(name)) || {};
    } catch (err) {
      // noop
    }
    return cookie;
  },

  set_seconds: function set_seconds(name, value, seconds, is_cross_subdomain, is_secure, is_cross_site, domain_override) {
    var cdomain = "",
        expires = "",
        secure = "";

    if (domain_override) {
      cdomain = "; domain=" + domain_override;
    } else if (is_cross_subdomain) {
      var domain = extract_domain(document$1.location.hostname);
      cdomain = domain ? "; domain=." + domain : "";
    }

    if (seconds) {
      var date = new Date();
      date.setTime(date.getTime() + seconds * 1000);
      expires = "; expires=" + date.toGMTString();
    }

    if (is_cross_site) {
      is_secure = true;
      secure = "; SameSite=None";
    }
    if (is_secure) {
      secure += "; secure";
    }

    document$1.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/" + cdomain + secure;
  },

  set: function set(name, value, days, is_cross_subdomain, is_secure, is_cross_site, domain_override) {
    var cdomain = "",
        expires = "",
        secure = "";

    if (domain_override) {
      cdomain = "; domain=" + domain_override;
    } else if (is_cross_subdomain) {
      var domain = extract_domain(document$1.location.hostname);
      cdomain = domain ? "; domain=." + domain : "";
    }

    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toGMTString();
    }

    if (is_cross_site) {
      is_secure = true;
      secure = "; SameSite=None";
    }
    if (is_secure) {
      secure += "; secure";
    }

    var new_cookie_val = name + "=" + encodeURIComponent(value) + expires + "; path=/" + cdomain + secure;
    document$1.cookie = new_cookie_val;
    return new_cookie_val;
  },

  remove: function remove(name, is_cross_subdomain, domain_override) {
    _.cookie.set(name, "", -1, is_cross_subdomain, false, false, domain_override);
  }
};

// _.localStorage
var _localStorage_supported = null;
_.localStorage = {
  is_supported: function is_supported() {
    if (_localStorage_supported !== null) {
      return _localStorage_supported;
    }

    var supported = true;
    try {
      var key = "__mplssupport__",
          val = "xyz";
      _.localStorage.set(key, val);
      if (_.localStorage.get(key) !== val) {
        supported = false;
      }
      _.localStorage.remove(key);
    } catch (err) {
      supported = false;
    }
    if (!supported) {
      console$1.error("localStorage unsupported; falling back to cookie store");
    }

    _localStorage_supported = supported;
    return supported;
  },

  error: function error(msg) {
    console$1.error("localStorage error: " + msg);
  },

  get: function get(name) {
    try {
      return window.localStorage.getItem(name);
    } catch (err) {
      _.localStorage.error(err);
    }
    return null;
  },

  parse: function parse(name) {
    try {
      return _.JSONDecode(_.localStorage.get(name)) || {};
    } catch (err) {
      // noop
    }
    return null;
  },

  set: function set(name, value) {
    try {
      window.localStorage.setItem(name, value);
    } catch (err) {
      _.localStorage.error(err);
    }
  },

  remove: function remove(name) {
    try {
      window.localStorage.removeItem(name);
    } catch (err) {
      _.localStorage.error(err);
    }
  }
};

_.register_event = function () {
  // written by Dean Edwards, 2005
  // with input from Tino Zijdel - crisp@xs4all.nl
  // with input from Carl Sverre - mail@carlsverre.com
  // with input from Mixpanel
  // http://dean.edwards.name/weblog/2005/10/add-event/
  // https://gist.github.com/1930440

  /**
   * @param {Object} element
   * @param {string} type
   * @param {function(...*)} handler
   * @param {boolean=} oldSchool
   * @param {boolean=} useCapture
   */
  var register_event = function register_event(element, type, handler, oldSchool, useCapture) {
    if (!element) {
      console$1.error("No valid element provided to register_event");
      return;
    }

    if (element.addEventListener && !oldSchool) {
      element.addEventListener(type, handler, !!useCapture);
    } else {
      var ontype = "on" + type;
      var old_handler = element[ontype]; // can be undefined
      element[ontype] = makeHandler(element, handler, old_handler);
    }
  };

  function makeHandler(element, new_handler, old_handlers) {
    var handler = function handler(event) {
      event = event || fixEvent(window.event);

      // this basically happens in firefox whenever another script
      // overwrites the onload callback and doesn't pass the event
      // object to previously defined callbacks.  All the browsers
      // that don't define window.event implement addEventListener
      // so the dom_loaded handler will still be fired as usual.
      if (!event) {
        return undefined;
      }

      var ret = true;
      var old_result, new_result;

      if (_.isFunction(old_handlers)) {
        old_result = old_handlers(event);
      }
      new_result = new_handler.call(element, event);

      if (false === old_result || false === new_result) {
        ret = false;
      }

      return ret;
    };

    return handler;
  }

  function fixEvent(event) {
    if (event) {
      event.preventDefault = fixEvent.preventDefault;
      event.stopPropagation = fixEvent.stopPropagation;
    }
    return event;
  }
  fixEvent.preventDefault = function () {
    this.returnValue = false;
  };
  fixEvent.stopPropagation = function () {
    this.cancelBubble = true;
  };

  return register_event;
}();

var TOKEN_MATCH_REGEX = new RegExp('^(\\w*)\\[(\\w+)([=~\\|\\^\\$\\*]?)=?"?([^\\]"]*)"?\\]$');

_.dom_query = function () {
  /* document.getElementsBySelector(selector)
    - returns an array of element objects from the current document
    matching the CSS selector. Selectors can contain element names,
    class names and ids and can be nested. For example:
      elements = document.getElementsBySelector('div#main p a.external')
      Will return an array of all 'a' elements with 'external' in their
    class attribute that are contained inside 'p' elements that are
    contained inside the 'div' element which has id="main"
      New in version 0.4: Support for CSS2 and CSS3 attribute selectors:
    See http://www.w3.org/TR/css3-selectors/#attribute-selectors
      Version 0.4 - Simon Willison, March 25th 2003
    -- Works in Phoenix 0.5, Mozilla 1.3, Opera 7, Internet Explorer 6, Internet Explorer 5 on Windows
    -- Opera 7 fails
      Version 0.5 - Carl Sverre, Jan 7th 2013
    -- Now uses jQuery-esque `hasClass` for testing class name
    equality.  This fixes a bug related to '-' characters being
    considered not part of a 'word' in regex.
    */

  function getAllChildren(e) {
    // Returns all children of element. Workaround required for IE5/Windows. Ugh.
    return e.all ? e.all : e.getElementsByTagName("*");
  }

  var bad_whitespace = /[\t\r\n]/g;

  function hasClass(elem, selector) {
    var className = " " + selector + " ";
    return (" " + elem.className + " ").replace(bad_whitespace, " ").indexOf(className) >= 0;
  }

  function getElementsBySelector(selector) {
    // Attempt to fail gracefully in lesser browsers
    if (!document$1.getElementsByTagName) {
      return [];
    }
    // Split selector in to tokens
    var tokens = selector.split(" ");
    var token, bits, tagName, found, foundCount, i, j, k, elements, currentContextIndex;
    var currentContext = [document$1];
    for (i = 0; i < tokens.length; i++) {
      token = tokens[i].replace(/^\s+/, "").replace(/\s+$/, "");
      if (token.indexOf("#") > -1) {
        // Token is an ID selector
        bits = token.split("#");
        tagName = bits[0];
        var id = bits[1];
        var element = document$1.getElementById(id);
        if (!element || tagName && element.nodeName.toLowerCase() != tagName) {
          // element not found or tag with that ID not found, return false
          return [];
        }
        // Set currentContext to contain just this element
        currentContext = [element];
        continue; // Skip to next token
      }
      if (token.indexOf(".") > -1) {
        // Token contains a class selector
        bits = token.split(".");
        tagName = bits[0];
        var className = bits[1];
        if (!tagName) {
          tagName = "*";
        }
        // Get elements matching tag, filter them for class selector
        found = [];
        foundCount = 0;
        for (j = 0; j < currentContext.length; j++) {
          if (tagName == "*") {
            elements = getAllChildren(currentContext[j]);
          } else {
            elements = currentContext[j].getElementsByTagName(tagName);
          }
          for (k = 0; k < elements.length; k++) {
            found[foundCount++] = elements[k];
          }
        }
        currentContext = [];
        currentContextIndex = 0;
        for (j = 0; j < found.length; j++) {
          if (found[j].className && _.isString(found[j].className) && // some SVG elements have classNames which are not strings
          hasClass(found[j], className)) {
            currentContext[currentContextIndex++] = found[j];
          }
        }
        continue; // Skip to next token
      }
      // Code to deal with attribute selectors
      var token_match = token.match(TOKEN_MATCH_REGEX);
      if (token_match) {
        tagName = token_match[1];
        var attrName = token_match[2];
        var attrOperator = token_match[3];
        var attrValue = token_match[4];
        if (!tagName) {
          tagName = "*";
        }
        // Grab all of the tagName elements within current context
        found = [];
        foundCount = 0;
        for (j = 0; j < currentContext.length; j++) {
          if (tagName == "*") {
            elements = getAllChildren(currentContext[j]);
          } else {
            elements = currentContext[j].getElementsByTagName(tagName);
          }
          for (k = 0; k < elements.length; k++) {
            found[foundCount++] = elements[k];
          }
        }
        currentContext = [];
        currentContextIndex = 0;
        var checkFunction; // This function will be used to filter the elements
        switch (attrOperator) {
          case "=":
            // Equality
            checkFunction = function checkFunction(e) {
              return e.getAttribute(attrName) == attrValue;
            };
            break;
          case "~":
            // Match one of space seperated words
            checkFunction = function checkFunction(e) {
              return e.getAttribute(attrName).match(new RegExp("\\b" + attrValue + "\\b"));
            };
            break;
          case "|":
            // Match start with value followed by optional hyphen
            checkFunction = function checkFunction(e) {
              return e.getAttribute(attrName).match(new RegExp("^" + attrValue + "-?"));
            };
            break;
          case "^":
            // Match starts with value
            checkFunction = function checkFunction(e) {
              return e.getAttribute(attrName).indexOf(attrValue) === 0;
            };
            break;
          case "$":
            // Match ends with value - fails with "Warning" in Opera 7
            checkFunction = function checkFunction(e) {
              return e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length;
            };
            break;
          case "*":
            // Match ends with value
            checkFunction = function checkFunction(e) {
              return e.getAttribute(attrName).indexOf(attrValue) > -1;
            };
            break;
          default:
            // Just test for existence of attribute
            checkFunction = function checkFunction(e) {
              return e.getAttribute(attrName);
            };
        }
        currentContext = [];
        currentContextIndex = 0;
        for (j = 0; j < found.length; j++) {
          if (checkFunction(found[j])) {
            currentContext[currentContextIndex++] = found[j];
          }
        }
        // alert('Attribute Selector: '+tagName+' '+attrName+' '+attrOperator+' '+attrValue);
        continue; // Skip to next token
      }
      // If we get here, token is JUST an element (not a class or ID selector)
      tagName = token;
      found = [];
      foundCount = 0;
      for (j = 0; j < currentContext.length; j++) {
        elements = currentContext[j].getElementsByTagName(tagName);
        for (k = 0; k < elements.length; k++) {
          found[foundCount++] = elements[k];
        }
      }
      currentContext = found;
    }
    return currentContext;
  }

  return function (query) {
    if (_.isElement(query)) {
      return [query];
    } else if (_.isObject(query) && !_.isUndefined(query.length)) {
      return query;
    } else {
      return getElementsBySelector.call(this, query);
    }
  };
}();

_.info = {
  campaignParams: function campaignParams() {
    var campaign_keywords = "utm_source utm_medium utm_campaign utm_content utm_term".split(" "),
        kw = "",
        params = {};
    _.each(campaign_keywords, function (kwkey) {
      kw = _.getQueryParam(document$1.URL, kwkey);
      if (kw.length) {
        params[kwkey] = kw;
      }
    });

    return params;
  },

  searchEngine: function searchEngine(referrer) {
    if (referrer.search("https?://(.*)google.([^/?]*)") === 0) {
      return "google";
    } else if (referrer.search("https?://(.*)bing.com") === 0) {
      return "bing";
    } else if (referrer.search("https?://(.*)yahoo.com") === 0) {
      return "yahoo";
    } else if (referrer.search("https?://(.*)duckduckgo.com") === 0) {
      return "duckduckgo";
    } else {
      return null;
    }
  },

  searchInfo: function searchInfo(referrer) {
    var search = _.info.searchEngine(referrer),
        param = search != "yahoo" ? "q" : "p",
        ret = {};

    if (search !== null) {
      ret["$search_engine"] = search;

      var keyword = _.getQueryParam(referrer, param);
      if (keyword.length) {
        ret["mp_keyword"] = keyword;
      }
    }

    return ret;
  },

  device: function device(user_agent) {
    if (/Windows Phone/i.test(user_agent) || /WPDesktop/.test(user_agent)) {
      return "Windows Phone";
    } else if (/iPad/.test(user_agent)) {
      return "iPad";
    } else if (/iPod/.test(user_agent)) {
      return "iPod Touch";
    } else if (/iPhone/.test(user_agent)) {
      return "iPhone";
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
      return "BlackBerry";
    } else if (/Android/.test(user_agent)) {
      return "Android";
    } else {
      return "";
    }
  },

  referringDomain: function referringDomain(referrer) {
    var split = referrer.split("/");
    if (split.length >= 3) {
      return split[2];
    }
    return "";
  },

  properties: function properties() {
    return _.extend(_.strip_empty_properties({
      $os: _.info.platform().os,
      $browser: _.info.platform().browser,
      $referrer: document$1.referrer,
      $referring_domain: _.info.referringDomain(document$1.referrer),
      $device: _.info.device(userAgent)
    }), {
      $current_url: win.location.href,
      $screen_height: screen.height,
      $screen_width: screen.width,
      mp_lib: "web",
      $lib_version: Config.LIB_VERSION,
      $insert_id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
      time: _.timestamp() / 1000 // epoch time in seconds
    });
  },

  people_properties: function people_properties() {
    return _.extend(_.strip_empty_properties({
      $os: _.info.platform().os,
      $browser: _.info.platform().browser
    }));
  },

  pageviewInfo: function pageviewInfo(page) {
    return _.strip_empty_properties({
      mp_page: page,
      mp_referrer: document$1.referrer,
      mp_browser: _.info.platform().browser,
      mp_platform: _.info.platform().os
    });
  },

  platform: function platform$$1() {
    var systemInfo = new platform();
    var _systemInfo$_platform = systemInfo._platform,
        os = _systemInfo$_platform.os,
        name = _systemInfo$_platform.name,
        version = _systemInfo$_platform.version;

    return {
      os: os.family + os.version + " " + os.architecture + "位",
      browser: name + " " + version,
      browserVersion: version
    };
  }
};

// naive way to extract domain name (example.com) from full hostname (my.sub.example.com)
var SIMPLE_DOMAIN_MATCH_REGEX = /[a-z0-9][a-z0-9-]*\.[a-z]+$/i;
// this next one attempts to account for some ccSLDs, e.g. extracting oxford.ac.uk from www.oxford.ac.uk
var DOMAIN_MATCH_REGEX = /[a-z0-9][a-z0-9-]+\.[a-z.]{2,6}$/i;

var extract_domain = function extract_domain(hostname) {
  var domain_regex = DOMAIN_MATCH_REGEX;
  var parts = hostname.split(".");
  var tld = parts[parts.length - 1];
  if (tld.length > 4 || tld === "com" || tld === "org") {
    domain_regex = SIMPLE_DOMAIN_MATCH_REGEX;
  }
  var matches = hostname.match(domain_regex);
  return matches ? matches[0] : "";
};

var addListener = function addListener(element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + type, handler);
  } else {
    element["on" + type] = handler;
  }
};

var onload$1 = function onload(cb) {
  if (document$1.readyState === "complete") {
    cb();
    return void 0;
  }
  addListener(window, "load", cb);
};

// EXPORTS (for closure compiler)
_["toArray"] = _.toArray;
_["isObject"] = _.isObject;
_["JSONEncode"] = _.JSONEncode;
_["JSONDecode"] = _.JSONDecode;
_["isBlockedUA"] = _.isBlockedUA;
_["isEmptyObject"] = _.isEmptyObject;
_["info"] = _.info;
_["info"]["device"] = _.info.device;
_["info"]["properties"] = _.info.properties;

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import "@fastly/performance-observer-polyfill/polyfill";
var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance;

var Perf = function () {
  function Perf(options) {
    var _this = this;

    _classCallCheck$1(this, Perf);

    this._options = options;
    this.isOnload = false;
    this.isDOMReady = false;
    this.cycleFreq = 100;

    this.domready(function () {
      var perfData = _this.getTimingReport();
      perfData.type = "domready";
      options.timingReport(perfData);
    });
    this.onload(function () {
      var perfData = _this.getTimingReport();
      perfData.type = "onload";
      options.timingReport(perfData);
    });

    onload$1(this.getResourceReport.bind(this));
  }

  _createClass$1(Perf, [{
    key: "getResourceReport",
    value: function getResourceReport() {
      var _this2 = this;

      // 过滤无效数据
      function filterTime(a, b) {
        return a > 0 && b > 0 && a - b >= 0 ? a - b : undefined;
      }

      var resolvePerformanceTiming = function resolvePerformanceTiming(timing) {
        var o = {
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

          ttfb: filterTime(timing.responseStart, timing.requestStart) // 首字节时间
        };

        return o;
      };

      var resolveEntries = function resolveEntries(entries) {
        return entries.map(function (item) {
          return resolvePerformanceTiming(item);
        });
      };

      if (window.PerformanceObserver) {
        var observer = new PerformanceObserver(function (list) {
          try {
            var entries = list.getEntries();
            _this2._options.resourceReport(resolveEntries(entries));
          } catch (e) {
            console.error(e);
          }
        });
        observer.observe({
          entryTypes: typeof this._options.type != "undefined" ? this._options.type : ["resource"]
        });
      } else {
        onload(function () {
          var entries = performance.getEntriesByType("resource");
          // cb(resolveEntries(entries));
        });
      }
    }
  }, {
    key: "getTimingReport",
    value: function getTimingReport() {
      if (!performance) {
        return void 0;
      }

      // 过滤无效数据；
      function filterTime(a, b) {
        return a > 0 && b > 0 && a - b >= 0 ? a - b : undefined;
      }

      // append data from window.performance
      var timing = performance.timing;

      var perfData = {
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
        domReady: filterTime(timing.domContentLoadedEventStart, timing.navigationStart), // domready时间
        interactive: filterTime(timing.domInteractive, timing.navigationStart), // 可操作时间
        ttfb: filterTime(timing.responseStart, timing.navigationStart) // 首字节时间
      };

      return perfData;
    }

    // DOM解析完成

  }, {
    key: "domready",
    value: function domready(callback) {
      var that = this;
      if (this.isOnload === true) {
        return void 0;
      }
      var timer = null;

      if (document.readyState === "interactive") {
        runCheck();
      } else if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function () {
          runCheck();
        }, false);
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

  }, {
    key: "onload",
    value: function onload$$1(callback) {
      var that = this;
      var timer = null;

      if (document.readyState === "complete") {
        runCheck();
      } else {
        addListener(window, "load", function () {
          runCheck();
        }, false);
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
  }]);

  return Perf;
}();

function configEvent(event, xhrProxy) {
  var e = {};
  for (var attr in event) {
    e[attr] = event[attr];
  } // xhrProxy instead
  e.target = e.currentTarget = xhrProxy;
  return e;
}

/*
 * author: wendux
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 */

var events = ['load', 'loadend', 'timeout', 'error', 'readystatechange', 'abort'];
var eventLoad = events[0];
var eventLoadEnd = events[1];
var eventReadyStateChange = events[4];

var prototype = 'prototype';





function getEventTarget(xhr) {
    return xhr.watcher || (xhr.watcher = document.createElement('a'));
}

function triggerListener(xhr, name) {
    var xhrProxy = xhr.getProxy();
    var callback = 'on' + name + '_';
    var event = configEvent({ type: name }, xhrProxy);
    xhrProxy[callback] && xhrProxy[callback](event);
    var evt;
    if (typeof Event === 'function') {
        evt = new Event(name, { bubbles: false });
    } else {
        // https://stackoverflow.com/questions/27176983/dispatchevent-not-working-in-ie11
        evt = document.createEvent('Event');
        evt.initEvent(name, false, true);
    }
    getEventTarget(xhr).dispatchEvent(evt);
}

function Handler(xhr) {
    this.xhr = xhr;
    this.xhrProxy = xhr.getProxy();
}

Handler[prototype] = Object.create({
    resolve: function resolve(response) {
        var xhrProxy = this.xhrProxy;
        var xhr = this.xhr;
        xhrProxy.readyState = 4;
        xhr.resHeader = response.headers;
        xhrProxy.response = xhrProxy.responseText = response.response;
        xhrProxy.statusText = response.statusText;
        xhrProxy.status = response.status;
        triggerListener(xhr, eventReadyStateChange);
        triggerListener(xhr, eventLoad);
        triggerListener(xhr, eventLoadEnd);
    },
    reject: function reject(error) {
        this.xhrProxy.status = 0;
        triggerListener(this.xhr, error.type);
        triggerListener(this.xhr, eventLoadEnd);
    }
});

function makeHandler(next) {
    function sub(xhr) {
        Handler.call(this, xhr);
    }

    sub[prototype] = Object.create(Handler[prototype]);
    sub[prototype].next = next;
    return sub;
}

var RequestHandler = makeHandler(function (rq) {
    var xhr = this.xhr;
    rq = rq || xhr.config;
    xhr.withCredentials = rq.withCredentials;
    xhr.open(rq.method, rq.url, rq.async !== false, rq.user, rq.password);
    for (var key in rq.headers) {
        xhr.setRequestHeader(key, rq.headers[key]);
    }
    xhr.send(rq.body);
});

var ResponseHandler = makeHandler(function (response) {
    this.resolve(response);
});

var ErrorHandler = makeHandler(function (error) {
    this.reject(error);
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO:

var ErrorCatch = function () {
  function ErrorCatch(options) {
    _classCallCheck$2(this, ErrorCatch);

    this._options = options;
    this.init();
  }

  _createClass$2(ErrorCatch, [{
    key: "formatError",
    value: function formatError(errObj) {
      var col = errObj.column || errObj.columnNumber; // Safari Firefox
      var row = errObj.line || errObj.lineNumber; // Safari Firefox
      var message = errObj.message;
      var name = errObj.name;

      console.log("error=======stacl=<<<>>>", errObj);

      var stack = errObj.stack;

      if (stack) {
        console.log("error====statck存在===stacl=<<<>>>", errObj);
        var matchUrl = stack.match(/https?:\/\/[^\n]+/);
        var urlFirstStack = matchUrl ? matchUrl[0] : "";
        var regUrlCheck = /https?:\/\/(\S)*\.js/;

        var resourceUrl = "";
        if (regUrlCheck.test(urlFirstStack)) {
          resourceUrl = urlFirstStack.match(regUrlCheck)[0];
        }

        var stackCol = null;
        var stackRow = null;
        var posStack = urlFirstStack.match(/:(\d+):(\d+)/);
        if (posStack && posStack.length >= 3) {
          var _posStack = _slicedToArray(posStack, 3);

          stackCol = _posStack[1];
          stackRow = _posStack[2];
        }

        // TODO formatStack
        return {
          content: stack,
          col: Number(col || stackCol),
          row: Number(row || stackRow),
          message: message,
          name: name,
          resourceUrl: resourceUrl
        };
      }

      return {
        row: row,
        col: col,
        message: message,
        name: name
      };
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;

      var _originOnerror = window.onerror;
      window.onerror = function () {
        for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
          arg[_key] = arguments[_key];
        }

        var errorMessage = arg[0],
            scriptURI = arg[1],
            lineNumber = arg[2],
            columnNumber = arg[3],
            errorObj = arg[4];


        var errorInfo = _this.formatError(errorObj);
        errorInfo._errorMessage = errorMessage;
        errorInfo._scriptURI = scriptURI;
        errorInfo._lineNumber = lineNumber;
        errorInfo._columnNumber = columnNumber;
        errorInfo.type = "onerror";
        _this._options.callback(errorInfo);
        _originOnerror && _originOnerror.apply(window, arg);
      };

      var _originOnunhandledrejection = window.onunhandledrejection;
      window.onunhandledrejection = function () {
        for (var _len2 = arguments.length, arg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          arg[_key2] = arguments[_key2];
        }

        var e = arg[0];
        var reason = e.reason;
        _this._options.callback({
          type: e.type || "unhandledrejection",
          reason: reason
        });
        _originOnunhandledrejection && _originOnunhandledrejection.apply(window, arg);
      };
    }
  }]);

  return ErrorCatch;
}();

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * @Author: zhanghongwei
 * @Date: 2020-05-23 14:36:43
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-24 09:20:10
 */

var Monitor = function () {
  function Monitor() {
    _classCallCheck$3(this, Monitor);

    this.init();
  }

  _createClass$3(Monitor, [{
    key: "init",
    value: function init() {
      // worker();
      // 收集ajax fetch
      // ajaxHook({
      //   //请求成功后进入
      //   onResponse: (response, handler) => {
      //     handler.next(response);
      //   },
      // });

      // 性能监控
      var pf = new Perf({
        timingReport: function timingReport(data) {
          console.log(123);
          console.log("data=======>", data);
        },
        resourceReport: function resourceReport(data) {}
      });

      // 收集错误信息
      // const error = new ErrorCatch({
      //   callback: (err) => {
      //     console.log("err================<", err);
      //   },
      // });
    }
  }]);

  return Monitor;
}();

new Monitor();
// import { _, userAgent, addListener } from "./utils/index";

// // let infos = _.info.properties(),;
// window._ = _;

// console.log("infos======>", _.info.pageviewInfo());

})));
//# sourceMappingURL=bundle.umd.js.map
