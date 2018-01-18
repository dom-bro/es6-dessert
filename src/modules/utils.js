/**
 * @param el：朴素的DOM元素
 * @param axis：哪个方向的偏移量（'x'|'y'）
 * @returns {number} 返回一个浮点型数值
 * @作用 获取DOM元素的transform:translate量
 *
 * !!! Don't edit this !!!
 * 该函数摘自 Swiper，为了方便以后同步，请不要做任何编辑
 */
/* eslint-disable */
export function getTranslate(el, axis = 'x') {
  let matrix;
  let curTransform;
  let transformMatrix;

  const curStyle = window.getComputedStyle(el, null);

  if (window.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;
    if (curTransform.split(',').length > 6) {
      curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
    }
    // Some old versions of Webkit choke when 'none' is passed; pass
    // empty string instead in this case
    transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
    matrix = transformMatrix.toString().split(',');
  }

  if (axis === 'x') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41;
    // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
    // Normal Browsers
    else curTransform = parseFloat(matrix[4]);
  }
  if (axis === 'y') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42;
    // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
    // Normal Browsers
    else curTransform = parseFloat(matrix[5]);
  }
  return curTransform || 0;
}
/* eslint-enable */

function getType (val) {
  return val
    ? Object(val).constructor.name
    : Object.prototype.toString.call(val).match(/\[object (.*)]/)[1]
}
export function isObject (val) {
  return getType(val) === 'Object'
}

export function isBoolean (val) {
  return getType(val) === 'Boolean'
}

export function isArray (val) {
  return getType(val) === 'Array'
}

/**
 * $.extend
 */
export function extend (...args) {
  let target = args[0],
    i = 1,
    deep = false

  // Handle a deep copy situation
  if (isBoolean(target)) {
    deep = target

    // Skip the boolean and the target
    target = Object(args[ i++ ])
  }
  for (; i < args.length; ++i) {
    const nextSource = args[i]
    // Skip over if null/undefined
    if (nextSource !== undefined && nextSource !== null) {
      for (let nextKey in nextSource) {
        // Avoid bugs when hasOwnProperty is shadowed
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          let from = nextSource[nextKey],
            to = target[nextKey]

          if (
            deep &&
            getType(to) === getType(from) &&
            (isObject(to) || isArray(to))
          ) {
            extend(deep, to, from)
          } else {
            target[nextKey] = from
          }
        }
      }
    }
  }
  return target
}

/**
 * @el jQuery对象 | DOM | 选择器
 * @event 事件类型（如 click，transitionend 等等），多个以空格分割
 * @callback 事件回调
 * @作用 改进 $.fn.one
 * @Why el 子元素的 event 事件会冒泡触发 el 的 event 事件，这不是本插件期望的效果。
 *      比如为 el 添加 click 事件，点击其子元素时也会触发 el 的 click 事件，
 *      本插件希望只在 event target 为 el 时才执行且仅执行一次事件处理器。
 */
export function triggerOnce (el, event, callback) {
  el = $(el)
  el.off(event) // 确保只绑一次
    .on(event, e => {
      if (e.target === el[0]) {
        // 确保回调只被执行一次
        el.off(event)
        callback()
      }
    })
}
