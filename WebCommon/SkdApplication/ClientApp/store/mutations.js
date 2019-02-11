// MUTATIONS мутации выполняютсья синхронно предназначена для модефецирования состояния

const mutations = {
	loadUser (state, payload) {
		state.user = payload
	},
	//добаавляем фото к входящему на сайт
	setPhotoToUser (state, payload) {
		state.user.photo = payload.photo
	},
	setUsersList (state, payload) {
		payload.forEach( u => u.R_DT = new Date(+u.R_DT.substring(u.R_DT.indexOf("(")+1,u.R_DT.indexOf(")"))));
		state.users_list = payload
	}
};

export default mutations
