import { arr2tree } from './arr2tree'
import { findNodeByID } from './findNodeByID'
export default function(comList, depList, empList, child, isOriginEmp) {
  const company = comList || []
  const department = depList || []
  comList = company.map(val => {
    return {
      id: val.KeyID,
      pid: val.PID,
      type: 'CompanyID',
      label: val.CompanyName,
      fullID: val.FullID
    }
  })
  depList = department.map(val => {
    return {
      id: val.KeyID,
      pid: val.PID,
      type: 'DepartmentID',
      label: val.DepartmentName,
      CorporationID: val.CorporationID,
      fullID: val.FullID
    }
  })
  const list = arr2tree(comList.concat(...depList))
  if (empList) {
    if (!isOriginEmp) {
      empList = empList.map(val => {
        return {
          id: val.KeyID,
          pid: val.PID,
          type: 'EmployeeID',
          label: val.UserName,
          fullID: val.FullID,
          tel: val.Tel
        }
      })
    } else {
      empList.forEach(v => {
        v.id = v.KeyID
        v.type = 'EmployeeID'
        v.label = v.UserName
        v.tel = v.Tel
        v.fullID = v.FullID
        v.pid = v.PID
      })
    }
    empList.forEach(val => {
      const pNode = findNodeByID(list, val.pid)
      if (pNode !== -1) {
        if (pNode[child]) {
          pNode[child].push(val)
        } else {
          pNode[child] = [val]
        }
      }
    })
  }
  return list
}
