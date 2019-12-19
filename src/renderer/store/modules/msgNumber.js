import { FindReadCount } from '../../api/usercenter'
const msgNumber = {
    state: {
        messageNumber: 0
    },
    mutations: {
        SEARCH_MSG_NUMBER: (state, number) => {
            state.messageNumber = number
        },

        UPDATE_MSG_NUMBER: (state) => {
            if (state.messageNumber <= 99 && state.messageNumber > 0) {
                state.messageNumber--
            }
        },

        CLEAR_MSG_NUMBER: (state) => {
            state.messageNumber = 0
        }
    },
    actions: {
        SearchMsgNumber({ commit }) {
            console.log('SEARCH_MSG_NUMBER')
            return new Promise(resolve => {
                setInterval(() => {
                    FindReadCount().then(response => {
                        commit('SEARCH_MSG_NUMBER', response.Data)
                    })
                }, 60000)
              resolve()
            })
        },
        UpdateMsgNumber({ commit }) {
            commit('UPDATE_MSG_NUMBER')
        },
        ClearMsgNumber({ commit }) {
            commit('CLEAR_MSG_NUMBER')
        }
    }
}

export default msgNumber
