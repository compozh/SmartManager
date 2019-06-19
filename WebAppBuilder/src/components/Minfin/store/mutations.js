export default {
  setUserData(state, payload){

    payload.email ? state.email = payload.email:null;
    payload.phone ? state.phone = payload.phone : null;
    payload.name ? state.name = payload.name : null;
    payload.position ? state.position = payload.position : null;
    payload.ticket ? state.ticket = payload.ticket : null;

    sessionStorage.setItem("minfinUser", JSON.stringify(state))

  },
  resetUserData(state){
    state.email = ""
    state.phone = "";
    state.name = "";
    state.position = "";
    state.ticket = "";
    sessionStorage.removeItem("minfinUser")
  }
}