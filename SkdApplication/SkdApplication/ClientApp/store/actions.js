// ACTIONS действия могут выполнятсья асинхронно предназначена для того, чтобы подготовить данные для мутации
import Axios from "axios";
import _ from "lodash"
import router from '../router/index'


let subfodler = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? "/skd":"";

const actions = ({
	// авторизация
	login (context, datauser) {
		return Axios.post(`${subfodler}/api/Account/Login`, {Login: datauser.login, Password: datauser.password})
			.then((response) => {
				if (response.data.access_token) {
					// сохраняем тикет в sessionStorage
					debugger;
					context.commit("setAuthorized",true);
					//context.commit("setUserName",response.data.username);
					console.log(response.data)
					
					localStorage.setItem('authToken', response.data.access_token);
				}
			}, response => {
			
			
			});
	},
	// загрузка списка пользователей
	loadUsersList (context) {
		
		return Axios.post(`${subfodler}/api/SkdApi/GetUsers`, undefined, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('authToken')}})
			.then((response) => {
				context.commit('setUsersList', response.data);//суём в мутацию
				
				let currentUser = _.find(response.data, u=>u.IsCurrent);
				context.commit('setCurrentUser', currentUser);
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
