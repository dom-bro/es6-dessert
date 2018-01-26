import IScroll from 'iscroll/build/iscroll-probe'
import { extend, addStyle } from './modules/utils'
import {requiredFloorStyle} from './modules/styles'

addStyle(requiredFloorStyle)

export default class Floor {
  constructor (options = {}) {
    let self = this

    let conf = self.conf = {
      container: '',
      iscroll: {},
      onFloorChange () {},
    }

    extend(conf, options)

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
      container = $(conf.container)

    container.addClass('es6Dessert-Floor-container')
    container.children().eq(0).addClass('es6Dessert-Floor-wrapper')

    conf.iscroll = extend({
      probeType: 3,
      scrollbars: true,
      // fadeScrollbars: true,
      mouseWheel: true,
    }, conf.iscroll)

    self.scroller = new IScroll(conf.container, conf.iscroll)

    self.scroller.on('scroll', function () {
      console.log(this.currentPage)
    })
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
  }
}

Floor.instances = []
