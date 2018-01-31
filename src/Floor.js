import IScroll from 'iscroll/build/iscroll-probe'
import { extend, addStyle, getType } from './modules/utils'
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
        bounce: false,
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

      // 事件开关，用于在 api 滚动时关闭事件监听
      self.eventSwitches = {}

      self.initIScroll()
    }
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

  /**
   * @description 初始化 IScroll，主要是监听 scroll 事件及处理回调执行时机
   */
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
    }
    function floorChangeCallback () {
      if (self.activeIndex !== self._activeIndex) {
        self._activeIndex = self.activeIndex
        conf.onFloorChange.call(self)
      }
    }

    calculateActiveFloor()
    floorChangeCallback()

    // 始终计算当前楼层
    self.scroller.on('scroll', calculateActiveFloor)

    // 控制 floorChange 回调触发
    self.on('scroll', floorChangeCallback)
      .stopListen('scroll')

    self.on('scrollStart', () => {
      self.resumeListen('scroll')
    })
    self.on('scrollEnd', () => {
      self.stopListen('scroll')
    })
  }

  /**
   * @param y [required]<Number> 滚动指定数量像素 scrollTo(100) | 相对现在位置滚动指定数量像素 scrollTo('+100') | 滚动到指定元素 scrollTo('#target-floor')
   * @param rest 可选的配置项
   *    time [optional]<Number> 单位毫秒(ms)
   *    easing [optional]<String> 以下值之一：quadratic | circular | back | bounce | elastic
   *    offsetY [optional]<Number> 用于在【滚动到指定元素】时再偏移指定个像素
   *
   * @description 垂直方向上滚动指定个单位，与 iscroll API 相反，正值向下滚动，负值向上滚动
   * @BestPractice iscroll.js 的 scrollToElement 方法对可滚动的区域做了限制，这是一般需求所期望的，并且 offsetY 的 true 值可居中。
   *    所以如果需要滚动到指定位置，请尽可能地优先使用它。scrollTo 和 scrollBy 想滚到哪就能滚到哪，这通常不是所预想的。除了 scrollTo(0)
   *    我实在想不出还有什么理由去使用它。
   */
  scrollTo (y, ...rest) {
    const self = this

    // 如果不停止可能导致 iscroll 在用户滑动后 momentum 时行为异常
    self.stopListen('scroll')

    // container 元素位置上的变化会导致定位错误（貌似只影响 api 滚动，手指滑动是没问题的），因此每次在这里 refresh 一下。至于元素内部发生变化，那就没办法了，只能用户手动 refresh 咯
    self.scroller.refresh()

    // frozen iscroll，在连续调用 scrollTo 之前清掉未完成的动画，防止相互影响，类似于 $.fn.stop(true).clearQueue()
    clearTimeout(self.scrollToTimer)
    self.scroller.isAnimating = false
    self.scrollToTimer = setTimeout(() => {
      let {time, easing, offsetY} = parseArgs(rest)

      if (/^\d+$/.test(y)) {
        // scrollTo(x, y, time, easing)
        self.scroller.scrollTo(
          0,
          -y,
          time,
          IScroll.utils.ease[easing]
        )
      } else if (/^[+-]\d+$/.test(y)) {
        // scrollBy(x, y, time, easing)
        self.scroller.scrollBy(
          0,
          -parseFloat(y),
          time,
          IScroll.utils.ease[easing]
        )
      } else {
        // scrollToElement(el, time, offsetX, offsetY, easing)
        self.scroller.scrollToElement(
          $(y)[0],
          time,
          0,
          offsetY,
          IScroll.utils.ease[easing]
        )
      }
    }, 20) // 之所以是 20 秒，是因为 iscroll 内部的实现是 requestAnimationFrame

    return self
  }

  /**
   * @param eventType beforeScrollStart | scrollCancel | scrollStart | scroll | scrollEnd
   * @param callback 事件回调
   * @description 封装一层 iscroll.prototype.on，使得可以监听和停止监听事件
   */
  on (eventType, callback) {
    const self = this

    self.scroller.on(eventType, () => {
      if (self.eventSwitches[eventType] !== false) {
        callback.call(self.scroller)
      }
    })

    return self
  }

  /**
   * @param eventTypes 可同时设置多个事件（以空格或逗号分隔如'scroll scrollCancel'）
   * @description 停止触发事件监听器，需要注意的是，事件仍在触发，但句柄不在执行了，这是 on 方法做的一小层处理
   */
  stopListen (eventTypes) {
    const self = this

    eventTypes.split(/[ ,]/).forEach(eventType => {
      self.eventSwitches[eventType] = false
    })

    return self
  }

  /**
   * @param eventTypes 可同时设置多个事件（以空格或逗号分隔如'scroll scrollCancel'）
   * @description 恢复触发事件监听器
   */
  resumeListen (eventTypes) {
    const self = this

    eventTypes.split(/[ ,]/).forEach(eventType => {
      self.eventSwitches[eventType] = true
    })

    return self
  }

  /**
   * @description iscroll.prototype.refresh
   */
  refresh () {
    const self = this

    self.scroller.refresh()

    return self
  }
}

Floor.instances = []

/**
 * @description 解析 scrollTo 方法的传入参数，类似于方法重载
 */
function parseArgs (rest) {
  let res = {}
  if (rest.length) {
    let arg0 = rest[0]
    switch (getType(arg0)) {
      // floor.scrollTo(y, time)
      case 'Number':
        res.time = arg0
        res.easing = rest[1]
        break
      // floor.scrollTo(y, easing)
      case 'String':
        res.easing = arg0
        break
      // floor.scrollTo(y, {time, easing})
      case 'Object':
        extend(res, arg0)
        break
    }
  }
  return res
}
