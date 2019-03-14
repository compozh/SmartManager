import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex);//расширяем функциональность всего vue

// все сосстояния имеет ли смысл разбивать по файлам?
const state = {
	onlineStatus:false,
	timeLastLoad:'',
	users_list: [],//состояние юзеров
	user: {}, //состояние юзера
	loginError:"",
	filter:"",
	loaded:false,
	authorized:!!localStorage.getItem('authToken'),
	grouping:localStorage.getItem('grouping')||0,
	sort:localStorage.getItem('sorting')||0
	
};


export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions
})
