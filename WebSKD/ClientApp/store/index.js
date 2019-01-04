import Vue from 'vue'
import Vuex from 'vuex'
import Axios from "axios"
import _ from "lodash"

Vue.use(Vuex)//расширяем функциональность всего vue

// все сосстояния имеет ли смысл разбивать по файлам?
const state = {
  users_list:[],//состояние юзеров
  user:[]//состояние юзера
}
// MUTATIONS мутации выполняютсья синхронно предназначена для модефецирования состояния
const mutations = {
  loadUser(state,payload){
    state.user = payload
  },
  //добаавляем фото к входящему на сайт
  addPhotoToUser(state,payload){
    state.user.photo=payload.photo
  },
  loadUsersList(state,payload){
    state.users_list=payload
  }
} 
// ACTIONS действиямогу твыполнятсья асинхронно предназначена для того, чтобы подготовить данные для мутации
const actions = ({
  actionLoadUser(context, datauser){
    Axios.post('/api/skdapi/login?login='+datauser.login+'&password='+datauser.password+'')
            .then((response)=>{
            context.commit('loadUser', response.data)//суём в мутацию
            console.log(response.data)
               
    });
  },
  actionLoadUsersList(context){
    Axios.post('/api/skdapi/getusers')
    .then((response)=>{
      context.commit('loadUsersList',response.data)//суём в мутацию
      console.log(response.data)
      context.commit('addPhotoToUser', _.find(context.getters.getUsersList, function (item){
             return item.USERID===context.getters.getUser.id;
      }));
       //var t=_.find(context.getters.getUsersList, {USERID: context.getters.getUser.id});
     });
  }
})

//дял получения состояния в объектах vue
const getters=({
  getUsersList:state=> state.users_list,
  getUser:state=>state.user
})
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
