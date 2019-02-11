// MUTATIONS мутации выполняютсья синхронно предназначена для модефецирования состояния

var moment = require('moment');
import 'moment/locale/ru';

moment.locale('ru');
const mutations = {
	loadUser (state, payload) {
		state.user = payload
	},
	//добаавляем фото к входящему на сайт
	setPhotoToUser (state, payload) {
		state.user.photo = payload.photo
	},
	setUsersList (state, payload) {
		payload.forEach( u => {
			
			u.DateTime = new Date(+u.R_DT.substring(u.R_DT.indexOf("(")+1,u.R_DT.indexOf(")")))
			if(u.DateTime.getFullYear() == 1){
				u.DateTimeText = "";
				return;
			}
			u.DateTimeText =  {
				Today: moment(u.DateTime).format("D MMM YYYY") == moment().format("D MMM YYYY"),
				Day:moment(u.DateTime).format("dddd"),
				Date:moment(u.DateTime).format("D MMM YYYY"),
				Time:moment(u.DateTime).format("HH:mm:ss"),
			}
			
		});
		state.users_list = payload
	}
};

export default mutations
