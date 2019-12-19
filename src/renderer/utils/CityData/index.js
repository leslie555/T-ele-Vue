import CityData from './data'
import menuData from './menuData'

function findNextByCode(city, code) {
  const next = city.find(val => {
    return val.value === code
  })
  return next
}

/**
 *
 * @param {String|Number} code 根据最后一位城市码获取到所有城市码数组
 */
const getCodeArrByCode = code => {
  if (!code) return []
  code = code + ''
  const pCode = code.slice(0, 2) + '0000'
  const cCode = code.slice(0, 4) + '00'
  return [pCode, cCode, code]
}
/**
 *
 * @param {String|Number|Array} code 根据城市码找到对应的城市名
 */
const getCityNameByCode = (code, type = 0) => {
  if (!code) return ''
  const codeArr =
      Object.prototype.toString.call(code) === '[object Array]'
          ? code
          : getCodeArrByCode(code)
  let cityName = ''
  const cityNameArr = []
  let next = CityData // 找到的下一级数据
  codeArr.forEach(val => {
    if (next) {
      next = findNextByCode(next, val)
      cityName += next.label + ' '
      cityNameArr.push(next.label)
      next = next.children
    }
  })
  return type === 0 ? cityName : cityNameArr
}

const getMenuDataByCityCode = (code) => {
  for (let i = 0; i < menuData.length; i++) {
    const item = menuData[i].children.find(y => y.value === code)
    if (item) return item
  }
  return {}
}

export { CityData, getCityNameByCode, getCodeArrByCode, getMenuDataByCityCode }
