import Axios from "axios";

const actions = ({
    SetLoginStatus(context,status){
      context.commit("setLoginStatus",status )
    },
    SetButtonParameters(context, parameters){
      context.commit('setAppData', parameters)    
    },
    Login(context,loginParam){
        //логин
        var postdata = {
          login:loginParam.login,
          password: loginParam.password,
          rememberMe: loginParam.rememberMe
      };
      // appstorage or applicationstorage
      localStorage.clear();
      return Axios.post('https://localhost:5001/api/values/Login',{Login: postdata.login, Password: postdata.password, RememberMe: postdata.rememberMe}, {withCredentials:true})
        .then((response) => {
          var token=JSON.parse(response.data.message);
          var username = response.data.user
          if (token.access_token) {
            localStorage.setItem('authToken', token.access_token);
            localStorage.setItem('userName', username);
            if(localStorage.getItem('authToken')){
              context.dispatch('GetControls');
              context.dispatch('SetLoginStatus',true);
            }
          }
        })
      },
      GetControls(context){
        return Axios.post('https://localhost:5001/api/values/GetControls', undefined, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('authToken')},withCredentials: true})
        .then((response=>{
          console.log(response.data)
          if(response.data != 'WRONG_TICKET' && response.data !=""){
            context.commit('setAppData', response.data)
            context.dispatch('GetToolbar');
          }else{
            localStorage.clear();
          }
        })
    )},
    
    GetToolbar(context){
      return Axios.post('https://localhost:5001/api/values/GetToolbar', undefined, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('authToken')},withCredentials: true})
        .then((response=>{
          console.log("toolbar = ",response.data)
            context.commit('setToolbar', response.data)
      })
      )
    },
    callAction(context, data){
      setTimeout(() => {
        alert
      }, 3000);
    }
});
export default actions
