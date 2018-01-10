function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var _sPO = Object.setPrototypeOf || function _sPO(o, p) {
  o.__proto__ = p;
  return o;
};

var _construct = typeof Reflect === "object" && Reflect.construct || function _construct(Parent, args, Class) {
  var Constructor,
      a = [null];
  a.push.apply(a, args);
  Constructor = Parent.bind.apply(Parent, a);
  return _sPO(new Constructor(), Class.prototype);
};

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var Popup =
/*#__PURE__*/
function () {
  function Popup() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Popup);
    var self = this;
    var conf = self.conf = {
      mask: '',
      // popup 遮罩（推荐传入 id）
      popup: '',
      // popup 内容（推荐传入 id）
      openBtn: '',
      // 打开弹窗按钮（推荐传入 class）
      closeBtn: '',
      // 关闭弹窗按钮（推荐传入 class）
      toggleBtn: '',
      // 打开/关闭按钮（推荐传入 class）
      duration: 0,
      // 动画时长
      closeOnClickMask: false,
      // 点击遮罩时是否关闭弹窗
      closeOthersOnOpen: true,
      // 打开一个弹窗时是否关闭其它弹窗
      popupStatus: '-popup-visible-',
      // 标识弹窗的状态
      activeToggleBtn: '-active-trigger-btn-',
      // 多个 toggle btn 情况
      // 回调会在动画结束之后调用
      onOpen: function onOpen() {},
      // 打开回调
      onClose: function onClose() {}
    };

    if (!window.$) {
      console.error('[Popup warn]: 该模块依赖 jQuery 库！');
      return;
    }

    $.extend(conf, options);
    var popup = $(conf.popup);

    if (!popup.length) {
      console.error("[Popup warn]: \u672A\u627E\u5230 ".concat(conf.popup, " \u5143\u7D20\uFF01"));
    }

    self.id = "popup_".concat(Popup.instances.length);
    Popup.instances.push(self); // 兼容对同一个 DOM 重复实例化（强烈不推荐）

    if (!popup.hasClass('-popup-created-')) {
      popup.addClass('-popup-created-');
      self.initEvents();
    }
  }

  _createClass(Popup, [{
    key: "initEvents",
    value: function initEvents() {
      var self = this,
          conf = self.conf;

      if (conf.openBtn) {
        $(document).on('click', conf.openBtn, function (e) {
          e.stopPropagation();
          self.event = e;
          self.open();
        });
      }

      if (conf.closeBtn) {
        $(document).on('click', conf.closeBtn, function (e) {
          e.stopPropagation();
          self.event = e;
          self.close();
        });
      }

      if (conf.closeOnClickMask) {
        $(document).on('click', conf.mask, function (e) {
          e.stopPropagation();
          self.event = e;
          self.close();
        });
      } // 此处的 toggle 第一次点击总是打开


      if (conf.toggleBtn) {
        $(document).on('click', conf.toggleBtn, function (e) {
          e.stopPropagation();
          self.event = e;
          var $this = $(this);

          if ($this.hasClass(conf.activeToggleBtn)) {
            self.toggle();
          } else {
            self.open();
            $(conf.activeToggleBtn).removeClass(conf.activeToggleBtn);
            $this.addClass(conf.activeToggleBtn);
          }
        });
      }

      $(document).on('click', conf.popup, function (e) {
        e.stopPropagation();
        self.event = e;
      });
    }
  }, {
    key: "closeOthersOnOpen",
    value: function closeOthersOnOpen() {
      var self = this,
          conf = self.conf;

      if (conf.closeOthersOnOpen) {
        Popup.instances.forEach(function (instance) {
          if (instance !== self) {
            instance.close();
          }
        });
      }
    }
  }, {
    key: "open",
    value: function open() {
      
    }
  }, {
    key: "close",
    value: function close() {
      
    }
  }, {
    key: "toggle",
    value: function toggle() {
      var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var onClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
      var self = this,
          conf = self.conf;
      var popup = $(conf.popup);
      popup.hasClass(conf.popupStatus) ? self.close(onClose) : self.open(onOpen);
    }
  }]);
  return Popup;
}();

Popup.instances = [];

/**
 * ES6小点心之通用弹窗
 */

var NormalPopup =
/*#__PURE__*/
function (_Popup) {
  _inherits(NormalPopup, _Popup);

  function NormalPopup() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, NormalPopup);
    return _possibleConstructorReturn(this, (NormalPopup.__proto__ || Object.getPrototypeOf(NormalPopup)).call(this, options));
  }

  _createClass(NormalPopup, [{
    key: "open",
    value: function open() {
      var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var self = this,
          conf = self.conf;
      self.closeOthersOnOpen();
      /*
       * 回调总是在打开/关闭动画结束之后被调用的，但是某些阻塞页面渲染的
       * 操作（比如 window.alert）可能会阻止弹窗显现，导致看上去回调
       * 像是在打开/关闭动画之前执行的。如果想避免这种情况，可在回调中使
       * 用 setTimeout 延迟执行这些阻塞操作。
       */

      function openCallback() {
        conf.onOpen.call(self);
        onOpen.call(self);
      }

      var popup = $(conf.popup),
          mask = $(conf.mask);

      if (!popup.hasClass(conf.popupStatus)) {
        mask.stop(true).clearQueue().fadeIn(conf.duration);
        popup.stop(true).clearQueue().fadeIn(conf.duration, openCallback);
        popup.addClass(conf.popupStatus);
      }

      return self;
    }
  }, {
    key: "close",
    value: function close() {
      var onClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var self = this,
          conf = self.conf;

      function closeCallback() {
        conf.onClose.call(self);
        onClose.call(self);
      }

      var popup = $(conf.popup),
          mask = $(conf.mask);

      if (popup.hasClass(conf.popupStatus)) {
        mask.stop(true).clearQueue().fadeOut(conf.duration);
        popup.stop(true).clearQueue().fadeOut(conf.duration, closeCallback);
        popup.removeClass(conf.popupStatus);
      }

      return self;
    }
  }]);
  return NormalPopup;
}(Popup);

var main = {
  NormalPopup: NormalPopup
};

export default main;
