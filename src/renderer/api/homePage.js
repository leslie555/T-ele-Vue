import request from '@/utils/request'

//  liu
// 待处理列表
export function homePagePendingDisposal(data = {}) {
  return request({
    url: '/UniversalVersionMethod/homePagePendingDisposal',
    method: 'post',
    data
  })
}
// 待处理保存
export function SaveHomePagePendingCon(data = {}) {
  return request({
    url: '/UniversalVersionMethod/SaveHomePagePendingCon',
    method: 'post',
    data
  })
}

// 待处理选中
export function ShowHomePagePendingCon(data = {}) {
  return request({
    url: '/UniversalVersionMethod/ShowHomePagePendingCon',
    method: 'post',
    data
  })
}

//	首页管理房源
export function ShowHomePageHouseInfoCount(data = {}) {
  return request({
    url: '/UniversalVersionMethod/ShowHomePageHouseInfoCount',
    method: 'post',
    data
  })
}

//	首页管理房源
export function HomePageOutTakeHouse(data = {}) {
  return request({
    url: '/UniversalVersionMethod/HomePageOutTakeHouse',
    method: 'post',
    data
  })
}

// 今日推荐房源
export function ShowRecommendedHouseList(data = {}) {
  return request({
    url: '/UniversalVersionMethod/ShowRecommendedHouseList',
    method: 'post',
    data
  })
}
// liu

// 首页账单查询
export function FirstPageBillStatistics(data = {}) {
  return request({
    url: '/SystemMethod/FirstPageBillStatistics',
    method: 'post',
    data
  })
}

// 首页查询出房业绩排名
export function SelectTakeOrOutRank(data = {}) {
  return request({
    url: '/SystemMethod/SelectTakeOrOutRank',
    method: 'post',
    data
  })
}

// 首页查询近六月业绩
export function SelectTakeOroutPerformance(data = {}) {
  return request({
    url: '/SystemMethod/SelectTakeOroutPerformance',
    method: 'post',
    data
  })
}

// 首页房源概况查询
export function SelectIncomeOrPayViewAll(data = {}) {
  return request({
    url: '/SystemMethod/SelectIncomeOrPayViewAll',
    method: 'post',
    data
  })
}

// 首页房源概况,业绩概况,收租逾期报表
export function HomeReport(data = {}) {
  return request({
    url: '/SystemMethod/HomeReport',
    method: 'post',
    data
  })
}

// 首页获客统计
export function ShowHouseCustomerReport(data = {}) {
  return request({
    url: '/SystemMethod/ShowHouseCustomerReport',
    method: 'post',
    data
  })
}

// 首页房源统计
export function FirstPageHouseStatistics(data) {
  return request({
    url: '/SystemMethod/FirstPageHouseStatistics',
    method: 'post',
    data
  })
}

// 首页备忘录查询
export function FindMemo(data) {
  return request({
    url: '/SystemMethod/FindMemo',
    method: 'post',
    data
  })
}

// 首页备忘录新增
export function InsertMemo(data) {
  return request({
    url: '/SystemMethod/InsertMemo',
    method: 'post',
    data
  })
}

// 首页新闻查看
export function ShowMessagePush(data) {
  return request({
    url: '/MessagePush/ShowMessagePush',
    method: 'post',
    data
  })
}

// 首页备忘录新增
export function EditMemo(data) {
  return request({
    url: '/SystemMethod/EditMemo',
    method: 'post',
    data
  })
}

// 应收应付预算次数
export function GetReceivableMeetCalculation(data) {
  return request({
    url: '/SystemMethod/GetReceivableMeetCalculation',
    method: 'post',
    data
  })
}

// 业绩图表数据
export function CompanyAchievement(data) {
  return request({
    url: '/SystemMethod/CompanyAchievement',
    method: 'post',
    data
  })
}

// 业绩排行数据
export function CompetentStaff(data) {
  return request({
    url: '/SystemMethod/CompetentStaff',
    method: 'post',
    data
  })
}

// 利润图表数据
export function CompanyProfit(data) {
  return request({
    url: '/SystemMethod/CompanyProfit',
    method: 'post',
    data
  })
}

// 利润排行数据
export function CompetentHouse(data) {
  return request({
    url: '/SystemMethod/CompetentHouse',
    method: 'post',
    data
  })
}

// 首页备忘录删除
export function DelMemoByID(data) {
  return request({
    url: '/SystemMethod/DelMemoByID',
    method: 'post',
    data
  })
}
