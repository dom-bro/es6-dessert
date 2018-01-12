import Popup from './Popup'

/**
 * 底部浮现弹窗
 */
export default class SlidePopup extends Popup {
  constructor(config) {
    config.duration = config.duration || 2300

    super(config)

    let self = this,
      {conf} = self,
      popup = $(conf.popup)

    self.firstInit = true

    // 后面会对popup的bottom属性添加动画，因此必须做如下样式处理
    let requiredStyle = `
        position: fixed !important;
        top: auto !important;
        bottom: 0 !important;
        transform: translateY(100%);
      `,
      oldStyle = popup.attr('style'),
      connector = oldStyle.substr(-1) === ';' ? '' : ';'

    popup.attr('style', oldStyle + connector + requiredStyle.replace(/\s/g, ''))
  }

  // 初始化弹窗位置
  init(force) {
    let self = this,
      {conf} = self,
      popup = $(conf.popup),
      popupHeight = popup.outerHeight()

    if (force || popupHeight < Math.abs(parseFloat(popup.css('bottom')))) {
      popup.css({
        // 对于会出现加载延迟的DOM，比如<img>，务必固定占位高度，否则 outerHeight 拿不到最终高度
        bottom: -popup.outerHeight(),
      })
    }

    self.firstInit = false
  }

  open(onOpen = function () {}) {
    let self = this,
      {conf} = self

    self.closeOthersOnOpen()

    function openCallback() {
      conf.onOpen.call(self)
      onOpen.call(self)
    }

    let popup = $(conf.popup),
      mask = $(conf.mask)

    if (!popup.hasClass(conf.popupStatus)) {
      self.init(self.firstInit)

      // mask.stop(true)
      //   .clearQueue()
      //   .fadeIn(conf.duration)
      //
      // popup.show()
      //   .addClass(conf.popupStatus)
      //   .stop(true)
      //   .clearQueue()
      //   .animate({
      //     bottom: 0
      //   }, conf.duration, openCallback)


    }

    return self
  }

  close(onClose = function () {}) {
    let self = this,
      {conf} = self

    function closeCallback() {
      conf.onClose.call(self)
      onClose.call(self)
    }

    let popup = $(conf.popup),
      mask = $(conf.mask)

    if (popup.hasClass(conf.popupStatus)) {
      mask.stop(true)
        .clearQueue()
        .fadeOut(conf.duration)

      popup.stop(true)
        .clearQueue()
        .animate({
          bottom: -popup.outerHeight()
        }, conf.duration, () => {
          popup.hide()
            .removeClass(conf.popupStatus)

          closeCallback()
        })
    }
  }
}
