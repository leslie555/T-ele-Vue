const HouseView = {
    state: {
      HouseInfo: {
        HouseKey: 0
      }
    },
    mutations: {
      GetHouseInfoByHouseKey: (state, view) => {
        state.HouseKey = view.HouseKey
      }
    }
  }
  export default HouseView
