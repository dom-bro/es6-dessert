class Popup {
  constructor(options = {}) {
    let self = this;

    let conf = self.conf = {
      mask: '',       // popup 遮罩（推荐传入 id）
      popup: '',      // popup 内容（推荐传入 id）
      openBtn: '',    // 打开弹窗按钮（推荐传入 class）
      closeBtn: '',   // 关闭弹窗按钮（推荐传入 class）
      toggleBtn: '',  // 打开/关闭按钮（推荐传入 class）
      effect: '',     // 过渡效果
      speed: 300,       // 动画时间
      closeOnClickMask: false,                    // 点击遮罩时是否关闭弹窗
      closeOthersOnOpen: true,                    // 打开一个弹窗时是否关闭其它弹窗
      popupStatus: '-popup-visible-',             // 标识弹窗的状态
      activeToggleBtn: '-active-trigger-btn-',    // 多个 toggle btn 情况

      // 回调会在动画结束之后调用
      onOpen() {
      },     // 打开回调
      onClose() {
      },    // 关闭回调
    };

    if (!window.$) {
      console.error('[Popup warn]: 该模块依赖 jQuery 库！');
      return
    }

    $.extend(conf, options);

    let popup = $(conf.popup);

    if (!popup.length) {
      console.error(`[Popup warn]: 未找到 ${conf.popup} 元素！`);
    }

    self.id = `popup_${Popup.instances.length}`;
    Popup.instances.push(self);

    // 兼容对同一个 DOM 重复实例化（强烈不推荐）
    if (!popup.hasClass('-popup-created-')) {
      popup.addClass('-popup-created-');
      self.initEvents();
    }
  }

  initEvents() {
    let self = this,
      {conf} = self;

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
    }

    // 此处的 toggle 第一次点击总是打开
    if (conf.toggleBtn) {
      $(document).on('click', conf.toggleBtn, function (e) {
        e.stopPropagation();
        self.event = e;

        let $this = $(this);
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

  closeOthersOnOpen() {
    let self = this,
      {conf} = self;

    if (conf.closeOthersOnOpen) {
      Popup.instances.forEach(function (instance) {
        if (instance !== self) {
          instance.close();
        }
      });
    }
  }

  open(onOpen = function () {
  }) {
  }

  close(onClose = function () {
  }) {
  }

  toggle(onOpen = function () {
         },
         onClose = function () {
         },) {
    let self = this,
      {conf} = self;

    let popup = $(conf.popup);

    popup.hasClass(conf.popupStatus) ? self.close(onClose) : self.open(onOpen);
  }
}
Popup.instances = [];

class NormalPopup extends Popup {
  constructor(options = {}) {
    super(options);
  }

  open(onOpen = function () {}) {
    let self = this,
      {conf} = self;

    function openCallback() {
      setTimeout(() => {
        conf.onOpen.call(self);
        onOpen.call(self);
      }, 0);
    }

    self.closeOthersOnOpen();

    let popup = $(conf.popup),
      mask = $(conf.mask);
    if (!popup.hasClass(conf.popupStatus)) {
      if (conf.effect === 'fade') {
        mask.stop(true).clearQueue().fadeIn(conf.duration);
        popup.stop(true).clearQueue().fadeIn(conf.duration, openCallback);
      } else {
        mask.show();
        popup.show();
        openCallback();
      }
      popup.addClass(conf.popupStatus);
    }

    return self
  }

  close(onClose = function () {}) {
    let self = this,
      {conf} = self;

    function closeCallback() {
      setTimeout(() => {
        conf.onClose.call(self);
        onClose.call(self);
      }, 0);
    }

    let popup = $(conf.popup),
      mask = $(conf.mask);
    if (popup.hasClass(conf.popupStatus)) {
      if (conf.effect === 'fade') {
        mask.stop(true).clearQueue().fadeOut(conf.duration);
        popup.stop(true).clearQueue().fadeOut(conf.duration, closeCallback);
      } else {
        mask.hide();
        popup.hide();
        closeCallback();
      }
      popup.removeClass(conf.popupStatus);
    }

    return self
  }
}

var main = {
  NormalPopup,
}

export default main;
