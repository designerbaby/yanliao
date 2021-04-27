/**
 * 在元素上绑定一个事件处理函数
 * @param {Object} element 元素实例
 * @param {String} event 事件名
 * @param {Function} handler 处理函数
 * @return {}
 */
export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * 在元素上移除一个事件处理函数
 * @param {Object} element 元素实例
 * @param {String} event 事件名
 * @param {Function} handler 处理函数
 * @return {}
 */
export const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * 动画函数（类似jq的animate）
 * @param {Object} el 元素实例
 * @param {Object} json 一组包含作为动画属性和终值的样式属性和及其值的集合（例：{height: 100, left: 100}）
 * @param {Function} callback 动画结束后的回调
 * @param {Number} speed 动画执行速率，默认是8
 */
export const startMove = (el, json, callback, speed = 8) => {
  el.timer && clearInterval(el.timer)

  el.timer = setInterval(function() {
    let isStop = true

    for (const attr in json) {
      let current = 0

      if (attr === 'opacity') {
        if (Math.round(parseFloat(getStyle(el, attr)) * 100) === 0) {
          current = Math.round(parseFloat(getStyle(el, attr)) * 100)
        } else {
          current = Math.round(parseFloat(getStyle(el, attr)) * 100) || 100
        }
      } else {
        current = parseInt(getStyle(el, attr), 10) || 0
      }
      let computedSpeed = (json[attr] - current) / speed
      computedSpeed =
        computedSpeed > 0 ? Math.ceil(computedSpeed) : Math.floor(computedSpeed)
      if (current !== json[attr]) {
        isStop = false
      }

      if (attr === 'opacity') {
        el.style.filter = 'alpha(opacity=' + (current + computedSpeed) + ')'
        el.style.opacity = (current + computedSpeed) / 100
      } else {
        el.style[attr] = current + computedSpeed + 'px'
      }
    }

    if (isStop) {
      clearInterval(el.timer)

      if (callback) {
        callback.call(el)
      }
    }
  }, 20)
}
