import Popup from './Popup'
import {requiredSlidePopupStyle} from "./styles"
import {getTranslate} from "./utils"

/**
 * 底部浮现弹窗
 */
Popup.addStyle(requiredSlidePopupStyle)

const transitionEnd = 'webkitTransitionEnd transitionend'

export default class SlidePopup extends Popup {
  constructor(config) {
    config.duration = config.duration || 300

    super(config)

    let self = this,
      {conf} = self,
      popup = $(conf.popup)

    popup.addClass('es6Dessert-SlidePopup')
  }

  required(){
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
    if(popup.css('display') === 'none'){
      popup.show()
      popupTransform = popup.css('transform')
      popup.hide()
    }
    if(popupTransform !== 'none'){
      console.error(`[${self.constructor.name} warn]: 该插件基于 transform 制造动画，将覆盖已有的 transform 值，因此不允许在 ${conf.popup} 元素上设置 transform 样式，请重新组织您的 html 和 css 结构！`)
    }
  }

  open(onOpen = function () {}) {
    super.open()

    let self = this,
      {conf} = self,
      popup = $(conf.popup),
      mask = $(conf.mask)

    self.closeOthersOnOpen()

    function openCallback() {
      conf.onOpen.call(self)
      onOpen.call(self)
    }

    if (!popup.hasClass(conf.popupStatus)) {
      // getTranslate 方法是拿不到 display:none 元素的偏移量的，
      // 因为 display:none 元素的 transform 值总是为 none
      popup.show()

      // 按照偏移量去计算动画时长，因为弹窗并不总是从最底下冉冉升起的
      let popupTranslate = Math.abs(getTranslate(popup[0], 'y')),
        percent = popupTranslate/popup.outerHeight(),
        duration = Math.round(conf.duration * percent)


      mask.stop(true)
        .clearQueue()
        .fadeIn(duration)
      // 更新弹窗状态
      popup.addClass(conf.popupStatus)
        .css({
          transform: 'translate3d(0,0,0)',
          transitionDuration: `${duration}ms`,
        })
        // 过渡未完成不会触发 transitionEnd 事件，因此需要移除之前绑定的事件
        .off(transitionEnd)
        .on(transitionEnd, e => {
          // popup 子元素的 transition 也会冒泡触发 popup 的 transitionEnd 事件，
          // 因此需要这层过滤，且必须用 on 而不能是 one 绑定事件
          if(e.target === popup[0]){
            // 确保回调只被执行一次
            popup.off(transitionEnd)

            openCallback()
          }
        })
    }

    return self
  }

  close(onClose = function () {}) {
    let self = this,
      {conf} = self,
      popup = $(conf.popup),
      mask = $(conf.mask)

    function closeCallback () {
      conf.onClose.call(self)
      onClose.call(self)
    }

    if (popup.hasClass(conf.popupStatus)) {
      let popupTranslate = Math.abs(getTranslate(popup[0], 'y')),
        percent = 1 - popupTranslate/popup.outerHeight(),
        duration = Math.round(conf.duration * percent)

      mask.stop(true)
        .clearQueue()
        .fadeOut(duration)

      popup.removeClass(conf.popupStatus)
        .css({
          transform: 'translate3d(0,100%,0)',
          transitionDuration: `${duration}ms`,
        })
        .off(transitionEnd)
        .on(transitionEnd, e => {
          if(e.target === popup[0]){
            popup.off(transitionEnd)
              .hide()

            closeCallback()
          }
        })
    }
  }
}
