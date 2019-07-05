const mutations = {

  /** Описание приложения */
  SetAppDescription(state, application){
    state.applicationDescription = application
  },

  /** Загрузка хранилища */
  setAppData(state, payload) {
    state.appData = {...state.appData, [payload.key]: payload.data}
  }
}

export default mutations
