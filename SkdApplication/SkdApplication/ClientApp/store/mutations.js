// MUTATIONS мутации выполняютсья синхронно предназначена для модефецирования состояния

var moment = require('moment');
import 'moment/locale/ru';

moment.locale('ru');
const mutations = {
	
	changeSort (state) {
		if(state.sort === 0){
			state.sort = 1
			localStorage.setItem("sorting",1);
			return
		}
		state.sort = 0
		localStorage.setItem("sorting",0);
		
	},
	changeGrouping(state, value){
		state.grouping = value
		localStorage.setItem("grouping",value);
	},
	setCurrentUser (state, currentUser) {
		state.user = currentUser;
	},
	setUsersList (state, payload) {
		payload.forEach( u => {
			
			u.DateTime = new Date(+u.R_DT.substring(u.R_DT.indexOf("(")+1,u.R_DT.indexOf(")")))
			if(u.DateTime.getFullYear() == 1){
				u.DateTimeText = "";
				u.IsAbsend = true;
				return;
			}
			
			u.IsGone = u.PLACENAME === "Улица";
			u.IsAbsend = u.PLACENAME === "Отсутствует в офисе";
			u.DateTimeText =  {
				Today: moment(u.DateTime).format("D MMM YYYY") === moment().format("D MMM YYYY"),
				Day: moment(u.DateTime).format("D MMM YYYY") == moment(new Date()).add(-1,'days').format("D MMM YYYY") ? "вчера" : moment(u.DateTime).format("dddd"),
				Date:moment(u.DateTime).format("D MMM YYYY"),
				Time:moment(u.DateTime).format("HH:mm"),
			}
			
		});
		state.users_list = payload;
		state.loaded = true;
	},
	setFilter (state, filter){
		let findFilter=filter;
		if(!filter)
		{
			findFilter=''
		}
		localStorage.setItem("filter",findFilter)
		state.filter = filter
	},
	setAuthorized(state, value){
		state.authorized = value;
	},
	logOut(state){
		state.authorized = false;
		state.user = {};
		state.users_list =[];
		localStorage.setItem('authToken', "");
	},
	setTimeLastLoad(state, payload){
		state.timeLastLoad=payload;
	},
	setOnlineStatus(state, payload){
		state.onlineStatus=payload;
	}
};

export default mutations
