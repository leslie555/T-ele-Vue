/**
 *
 * @param {Object} fileds 验证失败的对象
 * @param {Object} form 表单对象
 */
export function scrollToError(fileds, form, offsetY) {
  const filedsKeys = Object.keys(fileds)
  if (!filedsKeys.length) return
  const firstFiledKey = filedsKeys[0]
  const errorFiled = form.$children.find(val => val.prop === firstFiledKey)
  const errorEl = errorFiled.$el
  if (offsetY === undefined) {
    errorEl.scrollIntoView()
  } else {
    const distance = offsetY + errorEl.offsetTop
    document.documentElement.scrollTop = document.body.scrollTop = window.pageYOffset = distance
  }
}
