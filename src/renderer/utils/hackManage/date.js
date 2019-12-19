/* eslint-disable no-global-assign,no-extend-native */
// 重新定义Date函数

/**
 * 在Safari和IE8上执行 new Date('2017-12-8 11:36:45'); 会得到Invalid Date
 * 本函数重写默认的Date函数，以解决其在Safari，IE8上的bug
 */
// eslint-disable-next-line no-native-reassign
Date = (function(Date) {
  MyDate.prototype = Date.prototype
  return MyDate

  function MyDate() {
    // 当只有一个参数并且参数类型是字符串时，把字符串中的-替换为/
    if (arguments.length === 1) {
      let arg = arguments[0]
      if (Object.prototype.toString.call(arg) === '[object String]' && arg.indexOf('T') === -1) {
        // 兼容ios new Date
        if (arg.length === '7') {
          arg += '-01'
        }
        if (arg.length === '4') {
          arg += '-01-01'
        }
        arguments[0] = arg.replace(/-/g, '/')
        // console.log(arguments[0]);
      }
    }
    const bind = Function.bind
    const unbind = bind.bind(bind)
    return new (unbind(Date, null).apply(null, arguments))()
  }
}(Date))
// 新增addMonth方法
Date.isLeapYear = function(year) {
  return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
}

Date.getDaysInMonth = function(year, month) {
  return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
}

Date.prototype.isLeapYear = function() {
  return Date.isLeapYear(this.getFullYear())
}

Date.prototype.getDaysInMonth = function() {
  return Date.getDaysInMonth(this.getFullYear(), this.getMonth())
}

Date.prototype.addMonths = function(value) {
  var n = this.getDate()
  this.setDate(1)
  this.setMonth(this.getMonth() + value)
  this.setDate(Math.min(n, this.getDaysInMonth()))
  return this
}
