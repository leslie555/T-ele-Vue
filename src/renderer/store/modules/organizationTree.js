import { ShowStaffRelationIntoByEmployeeID } from '@/api/system'
import { getTreeNodeByValue } from '@/utils/arrUtil/treeArr'
import { localStorage } from '@/utils/storage'

const defaultTreeProps = {
  label: 'SysName',
  value: 'KeyID'
}
const createTree = (tree, data) => {
  if (!tree.length) return
  tree.forEach(val => {
    const children = data.filter(v => v.PID === val.KeyID)
    if (children.length) {
      val.children = children
    }
    createTree(children, data)
  })
  return tree
}

const treeData = {
  state: {
    treeData: localStorage.get('treeData'),
    isEmpty: localStorage.get('isEmpty')
  },

  mutations: {
    SET_ORGANIZATION_TREE: (state, treeData) => {
      state.treeData = treeData
    },
    SET_ISEMPTY: (state, isEmpty) => {
      state.isEmpty = isEmpty
    }
  },

  actions: {
    initOrganization({ commit, state }, Type) {
      ShowStaffRelationIntoByEmployeeID({
        Type
      }).then(({ Data }) => {
        let isEmpty
        if (Data && Data.length) {
          const topVal = Data.filter(v => !v.PID)
          const treeData = {
            ...state.treeData,
            [Type]: createTree(topVal, Data)
          }
          commit('SET_ORGANIZATION_TREE', treeData)
          localStorage.set('treeData', treeData)
          isEmpty = false
        } else {
          isEmpty = true
        }
        commit('SET_ISEMPTY', isEmpty)
        localStorage.set('isEmpty', isEmpty)
      })
    },
    updateOrganization({ commit, state }, data, orginPID) {
      const treeData = [...state.treeData]
      const originPNode = getTreeNodeByValue(
        treeData,
        orginPID,
        defaultTreeProps
      ).data
      const idx = originPNode.children.findIndex(v => v.KeyID === data.KeyID)
      if (originPNode.children[idx].children) {
        data.children = originPNode.children[idx].children
      }
      if (data.PID === orginPID) {
        // 组织结构未改变
        originPNode.children[idx] = data
      } else {
        const pNode = getTreeNodeByValue(
          this.treeData,
          data.PID,
          defaultTreeProps
        ).data
        originPNode.children.splice(idx, 1)
        pNode.children.push(data)
      }
      commit('SET_ORGANIZATION_TREE', treeData)
      localStorage.set('treeData', treeData)
    },
    addOrganization({ commit, state }, data) {
      const treeData = [...state.treeData]
      const node = getTreeNodeByValue(treeData, data.PID, defaultTreeProps).data
      node.children.push(data)
      commit('SET_ORGANIZATION_TREE', treeData)
      localStorage.set('treeData', treeData)
    }
  }
}

export default treeData
