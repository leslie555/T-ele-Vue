import store from '../../../store/index'
export default {
  bind(el, binding, vnode) {
    const actions = store.getters.currentActions
    const curAction = binding.arg
    el.style.display = actions.includes(curAction) ? 'inline-block' : 'none'
  }
}
