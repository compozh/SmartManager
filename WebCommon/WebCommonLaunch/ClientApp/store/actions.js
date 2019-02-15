// ACTIONS действия могут выполнятсья асинхронно предназначена для того, чтобы подготовить данные для мутации
import Axios from "axios";
import _ from "lodash"

const actions = ({
	// авторизация
	login (context, datauser) {
		return Axios.post('/api/Account/Login', {Login: datauser.login, Password: datauser.password})
			.then((response) => {
				if (response.data.access_token) {
					// сохраняем тикет в sessionStorage
					sessionStorage.setItem('authToken', response.data.access_token);
				}
			});
	},
	// загрузка списка пользователей
	loadUsersList (context) {
		return Axios.post('/api/SkdApi/GetUsers', undefined, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('authToken')}})
			.then((response) => {
				context.commit('setUsersList', response.data);//суём в мутацию
				context.commit('setPhotoToUser', _.find(context.getters.getUsersList, function (item) {
					return item.USERID === context.getters.getUser.id;
				}));
			});
	}
});

export default actions
