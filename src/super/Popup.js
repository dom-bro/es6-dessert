import {extend} from '../modules/utils'

export default class Popup {
  constructor (options = {}) {
    let self = this

    let conf = self.conf = {
      mask: '', // popup 遮罩（推荐传入 id）
      popup: '', // popup 内容（推荐传入 id）
      openBtn: '', // 打开弹窗按钮（推荐传入 class）
      closeBtn: '', // 关闭弹窗按钮（推荐传入 class）
      toggleBtn: '', // 打开/关闭按钮（推荐传入 class）
      duration: 0, // 动画时长
      closeOnClickMask: false, // 点击遮罩时是否关闭弹窗
      closeOthersOnOpen: true, // 打开一个弹窗时是否关闭其它弹窗
      popupStatus: '-popup-visible-', // 标识弹窗的状态
      activeToggleBtn: '-active-trigger-btn-', // 多个 toggle btn 情况

      // 回调会在动画结束之后调用
      onOpen () {}, // 打开回调
      onClose () {}, // 关闭回调
    }

    extend(conf, options)

    self.required()

    let popup = $(conf.popup)
    // 兼容对同一个 DOM 重复实例化（强烈不推荐）
    if (!popup.hasClass('-dessert-created-')) {
      popup.addClass('-dessert-created-')

      self.id = `popup_${Popup.instances.length}`
      Popup.instances.push(self)

      self.initEvents()
    }
  }

  initEvents () {
    let self = this,
      {conf} = self

    if (conf.openBtn) {
      $(document).on('click', conf.openBtn, e => {
        e.stopPropagation()
        self.event = e
        self.open()
      })
    }

    if (conf.closeBtn) {
      $(document).on('click', conf.closeBtn, e => {
        e.stopPropagation()
        self.event = e
        self.close()
      })
    }

    if (conf.closeOnClickMask) {
      $(document).on('click', conf.mask, e => {
        e.stopPropagation()
        self.event = e
        self.close()
      })
    }

    // 此处的 toggle 第一次点击总是打开
    if (conf.toggleBtn) {
      $(document).on('click', conf.toggleBtn, function (e) {
        e.stopPropagation()
        self.event = e

        let $this = $(this)
        if ($this.hasClass(conf.activeToggleBtn)) {
          self.toggle()
        } else {
          self.open()
          $(`.${conf.activeToggleBtn}`).removeClass(conf.activeToggleBtn)
          $this.addClass(conf.activeToggleBtn)
        }
      })
    }

    $(document).on('click', conf.popup, e => {
      e.stopPropagation()
      self.event = e
    })
  }

  closeOthersOnOpen () {
    let self = this,
      {conf} = self

    if (conf.closeOthersOnOpen) {
      Popup.instances.forEach(instance => {
        if (instance !== self) {
          instance.close()
        }
      })
    }
  }

  /*
   * 子类实现时务必调用 super.xxx()
   */
  required () {
    let self = this,
      {conf} = self

    if (!window.$) {
      throw `${self.constructor.name} Error: 该模块依赖 jQuery 库并且须将 jQuery 暴露为全局变量 window.$`
    }

    if (!conf.popup) {
      throw `${self.constructor.name} Error: 请在实例化时指定 popup 选项！`
    }

    let popup = $(conf.popup)
    if (!popup.length) {
      throw `${self.constructor.name} Error: 未找到 ${conf.popup} 元素！`
    }
    if (popup.css('display') !== 'none') {
      throw `${self.constructor.name} Error: 要求 ${conf.popup} 元素必须设置为 display:none！如果需要在页面加载进来就展示，请通过在实例化后直接调用 open 来实现，比如 new ${self.constructor.name}(options).open()`
    }

    if (conf.mask && !$(conf.mask).length) {
      throw `${self.constructor.name} Error: 未找到 ${conf.mask} 元素！`
    }

    if (conf.closeOnClickMask) {
      if (!conf.mask) {
        throw `${self.constructor.name} Error: closeOnClickMask 为 true 时必须传入 mask 选项`
      }
    }
  }
  open () {
    let self = this

    self.closeOthersOnOpen()
  }
  close () {}

  toggle (onOpen = function () {}, onClose = function () {}) {
    let self = this,
      {conf} = self,
      popup = $(conf.popup)

    popup.hasClass(conf.popupStatus)
      ? self.close(onClose)
      : self.open(onOpen)
  }
}
Popup.instances = []
