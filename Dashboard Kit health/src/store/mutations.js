// https://vuex.vuejs.org/en/mutations.html
//мутация
const mutations = {
  setInformationFromServer(sate,payload){
    sate.information_from_server_list=payload;
  }
}
export default mutations
