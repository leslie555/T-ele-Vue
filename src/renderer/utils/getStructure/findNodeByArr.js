export function findNodeByArr(tree, arr, cb) {
  let children = tree
  let node
  arr.forEach(val => {
    node = children.find(v => {
      return v.id === +val
    })
    if (node) {
      if (cb) {
        cb(node)
      }
      children = node.children
    } else {
      return -1
    }
  })
  return node
}
