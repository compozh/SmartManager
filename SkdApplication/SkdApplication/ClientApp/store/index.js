import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);//расширяем функциональность всего vue

// все сосстояния имеет ли смысл разбивать по файлам?
const state = {
	users_list: [],//состояние юзеров
	user: []//состояние юзера
};


//дял получения состояния в объектах vue
const getters = ({
	getUsersList: state => state.users_list,
	getUser: state => state.user
});
export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions
})
