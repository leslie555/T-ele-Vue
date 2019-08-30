import { previewOwnerContract } from '../../api/owner'
import { previewTenantContract } from '../../api/tenant'
import { localStorage } from '@/utils/storage'

const state = {
  state: {
    owner: {
      preview: localStorage.get('ownerPreview')
    },
    tenant: {
      preview: localStorage.get('tenantPreview')
    }
  },

  mutations: {
    SET_OWNER_PREVIEW: (state, data) => {
      state.owner.preview = data
    },
    SET_TENANT_PREVIEW: (state, data) => {
      state.tenant.preview = data
    }
  },

  actions: {
    // 获取业主合同预览
    setOwnerPreview({ commit }, data) {
      return new Promise((resolve, reject) => {
        previewOwnerContract(data)
          .then(({ Data }) => {
            localStorage.set('ownerPreview', Data)
            commit('SET_OWNER_PREVIEW', Data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取租客合同预览
    setTenantPreview({ commit }, data) {
      return new Promise((resolve, reject) => {
        previewTenantContract(data)
          .then(({ Data }) => {
            localStorage.set('tenantPreview', Data)
            commit('SET_TENANT_PREVIEW', Data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default state
