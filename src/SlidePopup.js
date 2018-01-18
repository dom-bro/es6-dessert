import Popup from './super/Popup'
import {requiredSlidePopupStyle} from './modules/styles'
import { getTranslate, triggerOnce } from './modules/utils'

/**
 * 底部浮现弹窗
 */
Popup.addStyle(requiredSlidePopupStyle)

const transitionEndEvent = 'webkitTransitionEnd transitionend'

function setTransform (el, val, transitionDuration) {
  el = $(el)
  el.css({
    webkitTransform: val,
    transform: val,
    transitionDuration: `${transitionDuration}ms`,
  })
}

export default class SlidePopup extends Popup {
  constructor (config) {
    config.duration = config.duration || 300

    super(config)

    let self = this,
      {conf} = self,
      popup = $(conf.popup)

    popup.addClass('es6Dessert-SlidePopup')
  }

  required () {
    super.required()

    let self = this,
      {conf} = self,
      popup = $(conf.popup)

    /*
     * 不允许在 popup 上设置 transform 样式
     */
    let popupTransform = popup.css('transform')
    // display:none 元素是拿不到 transform 值的，
    // 因此以迅雷不及掩耳盗铃铛之势快速 show 和 hide 一下，
    // 这不会引起浏览器的重绘，所以页面不会发生闪烁
    if (popup.css('display') === 'none') {
      popup.show()
      popupTransform = popup.css('transform')
      popup.hide()
    }
    if (popupTransform !== 'none') {
      console.error(`[${self.constructor.name} warn]: 该插件基于 transform 制造动画，将覆盖已有的 transform 值，因此不允许在 ${conf.popup} 元素上设置 transform 样式，请重新组织您的 html 和 css 结构！`)
    }
  }

  open (onOpen = function () {}) {
    super.open()

    let self = this,
      {conf} = self,
      popup = $(conf.popup),
      mask = $(conf.mask)

    if (!popup.hasClass(conf.popupStatus)) {
      // display:none 元素的 transform 值总是为 none，因此 getTranslate 方法是拿不到 display:none 元素的偏移量的，
      // 所以先把弹窗 show 出来
      popup.show()

      // 根据偏移量去计算动画时长，因为弹窗并不总是从最底下冉冉升起的
      let popupTranslate = Math.abs(getTranslate(popup[0], 'y')),
        percent = popupTranslate / popup.outerHeight(),
        duration = Math.round(conf.duration * percent)

      mask.stop(true).clearQueue().fadeIn(duration)
      // 更新弹窗状态
      popup.addClass(conf.popupStatus)
      setTransform(popup, 'translate3d(0,0,0)', duration)
      triggerOnce(popup, transitionEndEvent, () => {
        conf.onOpen.call(self)
        onOpen.call(self)
      })
    }

    return self
  }

  close (onClose = function () {}) {
    let self = this,
      {conf} = self,
      popup = $(conf.popup),
      mask = $(conf.mask)

    if (popup.hasClass(conf.popupStatus)) {
      let popupTranslate = Math.abs(getTranslate(popup[0], 'y')),
        percent = 1 - popupTranslate / popup.outerHeight(),
        duration = Math.round(conf.duration * percent)

      mask.stop(true).clearQueue().fadeOut(duration)
      popup.removeClass(conf.popupStatus)
      setTransform(popup, 'translate3d(0,100%,0)', duration)
      triggerOnce(popup, transitionEndEvent, () => {
        conf.onClose.call(self)
        onClose.call(self)
      })
    }
  }
}
