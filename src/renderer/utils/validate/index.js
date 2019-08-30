/**
 * Created by littleseven on 16/11/18.
 */

/* 合法uri*/
const validateURL = function(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
const validateLowerCase = function(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
const validateUpperCase = function(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
const validatAlphabets = function(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
const isObject = function(value) {
  return !!value && Object.prototype.toString.call(value) === '[object Object]'
}

// 判断是否是数组
const isArray = function(value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}

// 验证数字包括浮点数
const validNumber = function(val) {
  var reg = /^[0-9]+\.?[0-9]*$/
  return reg.test(val)
}

// 验证电话号码格式
const validatePhoneNumber = function(val) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(val)
}

export {
  validateURL,
  validateLowerCase,
  validateUpperCase,
  validatAlphabets,
  isObject,
  isArray,
  validNumber,
  validatePhoneNumber
}
