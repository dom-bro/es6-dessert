import IScroll from 'iscroll/build/iscroll-probe'
import { extend, addStyle } from './modules/utils'
import {requiredFloorStyle} from './modules/styles'

addStyle(requiredFloorStyle)

/**
 * 想根据精确的 distance 做些事情，但数据获取只允许一次
 */
export default class LoadMore extends IScroll {
  constructor (options = {}) {
    const conf = {
      container: '', // {String|Element}
      offset: 80, // {Number} 提前加载距离
      autoLoad: true, // {Boolean} 自动加载
      push () {}, // {Function}
      pull () {}, // {Function}
      loadDown () {}, // {Function}
      loadUp () {}, // {Function}

      probeType: 3,
      mouseWheel: true,
    }
    extend(true, conf, options)

    super(conf.container, conf)

    const self = this

    self.conf = conf
    self.loading = false // loading状态
    self.isLockUp = false // 是否锁定
    self.isLockDown = false
    self.isData = true // 是否有数据

    const container = $(conf.container)

    container.addClass('es6Dessert-Floor-container')

    self.initEvents()

    options.pull && self.pull()
    options.push && self.push()
  }

  isScrollable () {
    const self = this,
      {conf} = self

    return self.scrollerHeight > self.wrapperHeight + conf.offset
  }

  autoLoad () {
    const self = this,
      {conf} = self

    if (!self.isScrollable()) {
      self.loadDown()
    }
  }

  pull () {
    const self = this,
      {conf} = self

    if (!self.isScrollable()) {
      conf.pull.call(self, () => self.refreshOnce())
      self.pull()
    }
  }

  push () {
    const self = this,
      {conf} = self

    if (!self.isScrollable()) {
      conf.push.call(self, () => self.refreshOnce())
      self.push()
    }
  }

  refreshOnce () {
    const self = this
    /**
     * IScroll 的 `refresh` 方法会重置 `scroller` 位置
     * 如果是在 `pull` 或 `push` 的过程中则滑动结束再 refresh，
     * 否则就直接刷新
     */
    if (self.y > 0 || self.y < self.maxScrollY) {
      self.refreshable = true
    } else {
      console.log('refresh')
      self.refresh()
    }
  }

  initEvents () {
    const self = this,
      {conf} = self

    self.on('scroll', () => {
      // 顶部往下拉
      if (self.y > 0) {
        self.distance = self.y
        self.pull()
      // 底部往上推
      } else if (self.y < self.maxScrollY) {
        self.distance = self.maxScrollY - self.y
        self.push()
      // 中间
      } else if (self.y < self.maxScrollY - conf.offset) {

      }
    })

    self.on('scrollEnd', () => {
      if (self.refreshable) {
        self.refreshable = false
        console.log('refresh')
        self.refresh()
      }
    })
  }
}
