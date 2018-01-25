import { extend } from './modules/utils'
import Popup from './super/Popup'

export default class Floor {
  constructor (options = {}) {
    let self = this

    let conf = self.conf = {
      container: '',
      onFloorChange () {},
    }

    extend(conf, options)

    self.required()

    let container = $(conf.container)
    // 兼容对同一个 DOM 重复实例化（强烈不推荐）
    if (!container.hasClass('-dessert-created-')) {
      container.addClass('-dessert-created-')

      self.id = `floor_${Popup.instances.length}`
      Floor.instances.push(self)

      self.initEvents()
    }
  }

  initEvents () {

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
