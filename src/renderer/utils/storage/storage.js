
// 存储前缀
import { storage_prefix } from '../../config/index'

class Storage {
  constructor(type) {
    if (type === 'local') {
      this.store = window.localStorage
    } else if (type === 'session') {
      this.store = window.sessionStorage
    }
    this.prefix = storage_prefix
  }

  set(key, value) {
    try {
      value = JSON.stringify(value)
    } catch (e) {
      console.log(e)
    }

    this.store.setItem(encodeURIComponent(this.prefix + key), encodeURIComponent(value))

    return this
  }

  get(key) {
    if (!key) {
      throw new Error('没有找到key。')
    }
    if (typeof key === 'object') {
      throw new Error('key不能是一个对象。')
    }
    let value = this.store.getItem(encodeURIComponent(this.prefix + key))

    if (value === null) {
      return null
    }

    try {
      value = JSON.parse(decodeURIComponent(value))
    } catch (e) {
      value = {}
    }
    return value
  }

  remove(key) {
    this.store.removeItem(encodeURIComponent(this.prefix + key))
    return this
  }
}

export const localStorage = new Storage('local')
export const sessionStorage = new Storage('session')
