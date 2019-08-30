import { validatePhoneNumber } from './index'

const validatePhone = (rule, value, callback) => {
  if (validatePhoneNumber(value) || !value) {
    callback()
  } else {
    callback(new Error('电话号码格式不正确'))
  }
}

// const validate

export { validatePhone }
