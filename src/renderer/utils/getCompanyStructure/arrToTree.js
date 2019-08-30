export function arrToTree(arr) {
  if (arr.length <= 1) {
    return [...arr]
  }

  arr.forEach((val, index) => {
    const sArr = Array.prototype.concat(
      arr.slice(0, index),
      ...arr.slice(index + 1)
    )

    const children = sArr.filter(v => {
      return +v.pid === val.id
    })
    if (children.length) {
      val.children = children
    }
  })
  return arr.filter(v => {
    return !+v.pid
  })
}
