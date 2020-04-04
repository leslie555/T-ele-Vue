import { priceFormat } from '../../priceFormat'

export default {
// 指令的定义
  bind(el, binding, vnode) {
    const isInt = binding.modifiers.int
    const inputEl = el.querySelector('input')
    inputEl.addEventListener('blur', (event) => {
      const attr = inputEl.attributes
      let min
      let max
      if (attr.min) {
        min = attr.min.value
      }
      if (attr.max) {
        max = attr.max.value
      }
      let val = event.target.value
      if (val !== '') {
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
        val = val + ''
        if (val.indexOf('.') !== -1) {
          if (val.split('.')[1].length > 2) {
            val = priceFormat(val)
          }
        }
        val -= 0
        // eslint-disable-next-line no-eval
        // eval('vnode.context.' + binding.expression + '=val')
        console.log(vnode.context)
        const str = binding.expression.replace(/\[/g, '.').replace(/\]/g, '')
        const arr = str.split('.')
        let node = vnode.context
        arr.map((v, i) => {
          if (i < arr.length - 1) {
            node = node[v]
          } else {
            if (isNaN(v - 1)) {
              node[v] = val
            } else {
              vnode.context.$set(node, v - 0, val)
            }
          }
        })
      } else {
        event.target.value = val
      }
    })
    // 去掉e
    inputEl.addEventListener('keypress', (event) => {
      if (event.keyCode === 101) {
        event.preventDefault()
        return false
      }
    })
  },
  unbind(el) {
    // el.querySelector('input').removeEventListener('blur')
  }
}
