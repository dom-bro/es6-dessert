export default class CountDown{
  constructor(conf){
      let self = this
      // 默认配置
      self.conf = $.extend({
          startTime: 0,       // 开始时间戳
          endTime: 0,         // 结束时间戳
          format(val){return val.toString()},    // 对 this.days,...,this.seconds 的值格式化
          onDayChange(){},    // 天数变化时回调
          onHourChange(){},   // 小时变化时回调
          onMinuteChange(){}, // 分钟变化时回调
          onSecondChange(){}, // 秒数变化时回调
          onFinish(){},       // 倒计时结束回调
      }, conf)
      self.remainingTime = conf.endTime - conf.startTime

      self.ticks = 0

      self.countDown()
  }
  countDown(){
      let self = this,
          {conf} = self

      let leftSeconds = Math.floor(self.remainingTime/1000),
          leftMinutes = Math.floor(leftSeconds/60),
          leftHours = Math.floor(leftMinutes/60),
          leftDays = Math.floor(leftHours/24),
          s = leftSeconds % 60,
          m = leftMinutes % 60,
          h = leftHours % 24,
          d = leftDays % 365

      let cbs = []   // 回调队列


      if(self.ticks++){
          self.s !== s && cbs.push(conf.onSecondChange)
          self.m !== m && cbs.push(conf.onMinuteChange)
          self.h !== h && cbs.push(conf.onHourChange)
          self.d !== d && cbs.push(conf.onDayChange)
      }

      if(self.remainingTime <= 0){
          cbs.push(conf.onFinish)
      }else{
          setTimeout(()=>{self.countDown()}, 1000)
      }

      if(self.remainingTime >= 1000){
          self.remainingTime -= 1000;
      }else{
          self.remainingTime = 0;
      }

      $.extend(self, {
          // private
          s, m, h, d,

          // public
          seconds: conf.format(s),
          minutes: conf.format(m),
          hours: conf.format(h),
          days: conf.format(d),

      })

      cbs.forEach(cb => cb.call(self))
  }
}