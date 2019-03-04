// https://vuex.vuejs.org/en/getters.html
//геттеры

const getters = ({
	getInfoList: state => state.information_from_server_list,
	getLoginStatus: state => state.loginStatus,
	getErrorToday: state => state.errorToday,
	getLocalization: state => state.localization,
	getCardIsShow: state => state.cardIsShow,
	getDetailsErrorsTable: state => state.detailsErrorsTable,
	getDetailsSQLLongTable: state => state.detailsSQLLongTable,
	getDetailPerfExece: state => state.detailPerfExec,
	getDetailWebRequestExec: state => state.detailWebRequestExec,
	getDetailSchedulerFails:state => state.detailSchedulerFails, 
	getShowiframe:state => state.showiframe, 
	getPreLoading:state => state.preLoading, 
	getShowDateP:state => state.showDateP, 
	getUserName:state => state.userName, 
	getBlockedwindow:state => state.blockedWindow, 
	getCurentDate:state => state.curentDate, 
	getIsDetail:state => state.isDetail, 
	
	
	
});
export default getters
