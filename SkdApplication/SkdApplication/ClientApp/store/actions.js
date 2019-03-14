// ACTIONS действия могут выполнятсья асинхронно предназначена для того, чтобы подготовить данные для мутации
import Axios from "axios";
import _ from "lodash"
import router from '../router/index'
import moment from "moment";


let subfodler = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? "/skd":"";

const actions = ({
	inspection(context, date){
		var dateOffline = moment(date).format('DD.MM.YYYY');
		var curentDate = moment().format('DD.MM.YYYY');
		if(curentDate > dateOffline){
			context.commit('setTimeLastLoad', moment(date).format('DD.MM.YYYY HH:mm'));
		}else{
			context.commit('setTimeLastLoad', moment(date).format('HH:mm'));
		}
	},
	// авторизация
	login (context, datauser) {
		return Axios.post(`${subfodler}/api/Account/Login`, {Login: datauser.login, Password: datauser.password})
			.then((response) => {
				if (response.data.access_token) {
					context.commit("setAuthorized",true);
					localStorage.setItem('authToken', response.data.access_token);
				}
			}, response => {
			});
	},
	// загрузка списка пользователей
	loadUsersList (context) {
		if (localStorage.getItem("allUsers") && localStorage.getItem("user")) {
			context.commit('setUsersList', JSON.parse(localStorage.getItem("allUsers")));//суём в мутацию
			context.commit('setCurrentUser', JSON.parse(localStorage.getItem("user")));
			context.dispatch('inspection',localStorage.getItem('lastLoad'))
			context.commit('setOnlineStatus', false);

		}
		return Axios.post(`${subfodler}/api/SkdApi/GetUsers`, undefined, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('authToken')}})
			.then((response) => {
				if(response.data){
					console.log(response.data)
					context.commit('setUsersList', response.data);//суём в мутацию
					let currentUser = _.find(response.data, u=>u.IsCurrent);
					let lastTimeDownload = moment();

					context.commit('setCurrentUser', currentUser);
					context.commit('setTimeLastLoad',  moment().format('HH:mm'));
					context.commit('setOnlineStatus', true);

					localStorage.setItem('allUsers', JSON.stringify(response.data));
					localStorage.setItem('user', JSON.stringify(currentUser));
					localStorage.setItem('lastLoad', lastTimeDownload);
				}
			}, (data)=>{
				if(data.response.status == 401){
					localStorage.setItem('authToken', "");
					router.push("login")
				}
			});
	},
	setFilter (context, filter){
		context.commit('setFilter', filter)
	}
});
export default actions
