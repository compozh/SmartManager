import Vue from 'vue'

const mutations = {

  /** Описание приложения */
  SetAppDescription(state, application){
    state.applicationDescription = application
  },

  /** Загрузка хранилища */
  setAppData(state, payload) {
    Vue.set(state.appData, payload.key, payload.data)
  }
}

export default mutations
