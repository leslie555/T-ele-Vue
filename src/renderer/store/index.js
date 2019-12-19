import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import tagsView from './modules/tagsView'
import house from './modules/house'
import homePage from './modules/homePage'
import msgNumber from './modules/msgNumber'
import enumData from './modules/enum'
import finance from './modules/finance'
import currentPage from './modules/currentPage'
import contract from './modules/contract'
import logOutAlerted from './modules/logOutAlerted'
import examine from './modules/examine'
import organizationTree from './modules/organizationTree'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    msgNumber,
    enumData,
    finance,
    homePage,
    house,
    currentPage,
    contract,
    logOutAlerted,
    examine,
    organizationTree
  },
  getters
})

export default store
