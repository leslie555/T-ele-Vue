import { GetPaymentAccount, QueryBillItem } from '../../api/ownerBill'

const state = {
  state: {
    billItem: {
      data: [],
      props: {
        children: 'Children',
        value: 'KeyID',
        label: 'Name'
      }
    }, // 账单树形结构数据
    accountData: []
  },

  mutations: {
    SET_BILL_ITEM: (state, data) => {
      state.billItem.data = data
    },
    SET_BILL_Account: (state, data) => {
      state.accountData = data
    }
  },

  actions: {
    // 获取所有账单项目
    refreshBillItem({ commit }) {
      return new Promise((resolve, reject) => {
        QueryBillItem()
          .then(({ Data }) => {
            commit('SET_BILL_ITEM', Data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 账户
    // 获取所有账户管理账号
    refreshAccountItem({ commit }) {
      return new Promise((resolve, reject) => {
        GetPaymentAccount()
          .then(({ Data }) => {
            commit('SET_BILL_Account', Data)
            resolve(Data)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default state
