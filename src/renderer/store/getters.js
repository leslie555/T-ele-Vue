const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userinfo: state => state.user.userinfo,
  prevPath: state => state.user.prevPath,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  messageNumber: state => state.msgNumber.messageNumber,
  enumList: state => state.enumData.enumList,
  billItem: state => state.finance.billItem,
  currentActions: state => state.currentPage.currentActions,
  contract: state => state.contract,
  accountData: state => state.finance.accountData,
  homePageRemark: state => state.homePage.HomePageRemark,
  logOutAlerted: state => state.logOutAlerted.logOutAlerted,
  examine: state => state.examine.activeIndex
}
export default getters
