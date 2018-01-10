import Popup from './Popup';

export default class NormalPopup extends Popup {
  constructor(options = {}) {
    super(options)
  }

  open(onOpen = function () {}) {
    let self = this,
      {conf} = self

    function openCallback() {
      setTimeout(() => {
        conf.onOpen.call(self)
        onOpen.call(self)
      }, 0)
    }

    self.closeOthersOnOpen()

    let popup = $(conf.popup),
      mask = $(conf.mask)
    if (!popup.hasClass(conf.popupStatus)) {
      if (conf.effect === 'fade') {
        mask.stop(true).clearQueue().fadeIn(conf.duration)
        popup.stop(true).clearQueue().fadeIn(conf.duration, openCallback)
      } else {
        mask.show()
        popup.show()
        openCallback()
      }
      popup.addClass(conf.popupStatus)
    }

    return self
  }

  close(onClose = function () {}) {
    let self = this,
      {conf} = self

    function closeCallback() {
      setTimeout(() => {
        conf.onClose.call(self)
        onClose.call(self)
      }, 0)
    }

    let popup = $(conf.popup),
      mask = $(conf.mask)
    if (popup.hasClass(conf.popupStatus)) {
      if (conf.effect === 'fade') {
        mask.stop(true).clearQueue().fadeOut(conf.duration)
        popup.stop(true).clearQueue().fadeOut(conf.duration, closeCallback)
      } else {
        mask.hide()
        popup.hide()
        closeCallback()
      }
      popup.removeClass(conf.popupStatus)
    }

    return self
  }
}
