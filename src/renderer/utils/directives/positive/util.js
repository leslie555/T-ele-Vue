import { priceFormat } from '../../priceFormat'

export default function(model, key, min, isInt, max, callback, deep, isNumber) {
  let val = window.event.target.value
  if (isNumber && val === '') {
    val = 0
  }
  if (val !== '') {
    val += ''
    val = val.replace(/e/g, '') // 去掉e
    val -= 0
    if (isInt) {
      val = Math.floor(val)
    }
    if (min !== undefined) {
      if (val < min - 0) {
        val = min
      }
    }
    if (max !== undefined) {
      if (val > max - 0) {
        val = max
      }
    }
    val += ''
    if (val.indexOf('.') !== -1) {
      if (val.split('.')[1].length > 2) {
        val = priceFormat(val)
      }
    }
    val -= 0
  }
  if (isNaN(key - 1)) {
    model[key] = val
  } else {
    // 数组
    this._self.$set(model, key - 0, val)
  }
  if (val === '' || deep) {
    window.event.target.value = val
  }
  if (callback) {
    callback()
  }
}
