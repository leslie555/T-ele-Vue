export function findNodeByID(list, id) {
  let res
  for (let i = 0; i < list.length; i++) {
    const node = list[i]
    if (node.label) {
      if (node.id === +id) {
        return node
      } else {
        if (node.children) {
          res = findNodeByID(node.children, id)
          if (res !== -1) {
            return res
          }
        }
      }
    }
  }
  return -1
}
