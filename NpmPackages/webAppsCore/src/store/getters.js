const getters = ({
  getAppData (state) {
    return key=>state.appData[key]
  }
})
export default getters
