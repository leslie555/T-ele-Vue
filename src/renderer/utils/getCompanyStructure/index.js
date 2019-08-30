import { arrToTree } from './arrToTree'
// 获取城市-大店-分店组织架构
export default function(filialeList, bigShopList, subbranchList) {
  const filiale = filialeList || []
  const bigShop = bigShopList || []
  const subbranch = subbranchList || []
  filialeList = filiale.map(val => {
    return {
      id: val.KeyID,
      pid: val.PID,
      type: 'FilialeID',
      label: val.CompanyName,
      fullID: val.FullID
    }
  })
  bigShopList = bigShop.map(val => {
    return {
      id: val.KeyID,
      pid: filialeList.length ? val.PID : 0,
      type: 'BigShopID',
      label: val.CompanyName,
      fullID: val.FullID
    }
  })
  subbranchList = subbranch.map(val => {
    return {
      id: val.KeyID,
      pid: bigShopList.length ? val.PID : 0,
      type: 'SubbranchID',
      label: val.CompanyName,
      fullID: val.FullID
    }
  })
  const companyList = filialeList
  companyList.push(...bigShopList)
  companyList.push(...subbranchList)
  const tree = arrToTree(companyList)
  return tree
}
