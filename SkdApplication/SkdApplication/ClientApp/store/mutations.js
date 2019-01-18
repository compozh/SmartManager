// MUTATIONS мутации выполняютсья синхронно предназначена для модефецирования состояния

const mutations = {
  loadUser(state,payload){
    state.user = payload
  },
  //добаавляем фото к входящему на сайт
  setPhotoToUser(state,payload){
    state.user.photo=payload.photo
  },
  setUsersList(state,payload){
    state.users_list=payload
  }
}

export default mutations
