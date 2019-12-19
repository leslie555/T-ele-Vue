import { validatePhoneNumber } from './index'

const validatePhone = (rule, value, callback = new Function()) => {
  if (validatePhoneNumber(value) || !value) {
    callback()
    return false
  } else {
    callback(new Error(`电话长度为11位,您只输入了${value.length}位`))
    return `电话长度为11位,您只输入了${value.length}位`
  }
}

const validateCard = (rule, value, callback = new Function()) => {
  if (value && value.length === 18 || value && value.length === 15 || !value) {
    callback()
    return false
  } else {
    callback(new Error(`身份证长度为18位,您只输入了${value.length}位`))
    return `身份证长度为18位,您只输入了${value.length}位`
  }
}
// const validate

export { validatePhone, validateCard }
