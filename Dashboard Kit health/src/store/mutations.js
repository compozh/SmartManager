// https://vuex.vuejs.org/en/mutations.html
//мутация
const mutations = {
  setInformationFromServer(state,payload){
    state.information_from_server_list=payload;
  },
  setLoginStatus(state,payload){
    state.loginStatus=payload;
  },
  setErrorToday(state, payload){
    state.errorToday=payload;
  },
  setCardIsShow(state,payload){
    state.cardIsShow=payload;
  },
  setDetailsErrorsTable(state, payload){
    state.detailsErrorsTable=payload;
  },
  setDetailsSQLLongTable(state, payload){
    state.detailsSQLLongTable=payload;
  },
  setDetailPerfExec(state, payload){
    state.detailPerfExec=payload;
  },
  setDetailWebRequestExec(state, payload){
    state.detailWebRequestExec=payload
  },
  setShowiframe(state, payload){
    state.showiframe=payload;
  },
  setDetailSchedulerFails(state, payload){
    state.detailSchedulerFails=payload;
  },
  setPreLoading(state, payload){
    state.preLoading=payload;
  },
  setShowDateP(state, payload){
    state.showDateP=payload;
  },
  setUserName(state, payload){
    state.userName=payload;
  },
  setBlockedWindow(state, payload){
    state.blockedWindow=payload;
  },
  setCurentDate(state,payload){
    state.curentDate= payload;
  },
  setIsDetail(state,payload){
    state.isDetail= payload;
  }
  
}
export default mutations
