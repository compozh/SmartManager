// https://vuex.vuejs.org/en/getters.html
//геттеры

const getters = ({
	getInfoList: state => state.information_from_server_list,
	getLoginStatus: state => state.loginStatus,
	getErrorToday: state => state.errorToday,
});
export default getters
