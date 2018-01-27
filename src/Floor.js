import IScroll from 'iscroll/build/iscroll-probe'
import { extend, addStyle } from './modules/utils'
import {requiredFloorStyle} from './modules/styles'

addStyle(requiredFloorStyle)

export default class Floor {
  constructor (options = {}) {
    let self = this

    let conf = self.conf = {
      container: '',
      itemClass: '',
      baseline: 0.5,
      baselineDebug: false,
      iscroll: {
        probeType: 3,
        mouseWheel: true,
        scrollbars: true,
        fadeScrollbars: true,
        interactiveScrollbars: true,
        shrinkScrollbars: 'scale',
      },
      onFloorChange () {},
    }

    extend(true, conf, options)

    self.required()

    let container = $(conf.container)
    // 兼容对同一个 DOM 重复实例化（强烈不推荐）
    if (!container.hasClass('-dessert-created-')) {
      container.addClass('-dessert-created-')

      self.id = `floor_${Floor.instances.length}`
      Floor.instances.push(self)

      self.initIScroll()
    }
  }

  initIScroll () {
    let self = this,
      {conf} = self,
      container = $(conf.container),
      wrapper = container.children().eq(0)

    container.addClass('es6Dessert-Floor-container')

    if (conf.baselineDebug) {
      let lineStyle = `
        position: absolute;
        z-index: 1;
        width: 100%;
        top: ${conf.baseline * 100}%;
        left: 0;
        border-bottom: 1px dashed #000;
      `
      container.append(`<div style="${lineStyle}"></div>`)
    }

    self.scroller = new IScroll(conf.container, conf.iscroll)
    self.activeIndex = 0
    self._activeIndex = -1

    function calculateActiveFloor () {
      wrapper.children(conf.itemClass).each((index, el) => {
        /* $.fn.offset 方法是不包含 margin 的，因此定位逻辑就是：
         * 当 floor 距容器顶部(包含padding和border)的距离小于基准线距容器顶部的距离时，
         * 即floor滑到了基准线上方，此 floor 变为 activeFloor。
         * 也即基准线穿过的楼层即是焦点楼层。
         */
        if ($(el).offset().top - container.offset().top < parseFloat(container.css('border-top-width')) + container.innerHeight() * conf.baseline) {
          self.activeIndex = index
        }
      })
      if (self.activeIndex !== self._activeIndex) {
        self._activeIndex = self.activeIndex
        conf.onFloorChange.call(self)
      }
    }

    calculateActiveFloor()

    self.scroller.on('scroll', calculateActiveFloor)
  }

  required () {
    let self = this,
      {conf} = self,
      container = $(conf.container)

    if (!window.$) {
      throw `${self.constructor.name} Error: 该模块依赖 jQuery 库并且须将 jQuery 暴露为全局变量 window.$`
    }

    if (!conf.container) {
      throw `${self.constructor.name} Error: 请在实例化时指定 container 选项！`
    }

    if (!container.length) {
      throw `${self.constructor.name} Error: 未找到 ${conf.container} 元素！`
    }

    const invisibleError = `${self.constructor.name} Error: 你实例化 Floor 的时机必须是在 ${conf.container} 元素可见后，即 ${conf.container} 元素及其所有祖先元素的 display 属性都不为 none 后！`
    if (container.css('display') === 'none') {
      throw invisibleError
    }
    container.parents().each(function () {
      if ($(this).css('display') === 'none') {
        throw invisibleError
      }
    })
  }
}

Floor.instances = []
