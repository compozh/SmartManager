// https://vuex.vuejs.org/en/actions.html
import Axios from "axios";
//Действия
const actions = ({
  getInfoFromServer(context){
    var postdata = {
      calcId: 'GET_PROJECT_HEALTH_SUMMARY ',
      args: null,
      ticket: null
  };
  var headers = {
    'Content-Type': 'application/json',
    'Data-Type': 'json'
  };
  var datas;
    return Axios.post('http://m.it.ua/ws/WebService.asmx/ExecuteEx',postdata,headers)
    .then((response=>{
      datas = response.data.d
      datas = JSON.stringify(datas);
      datas = JSON.parse(datas)
      datas = JSON.parse(datas)
      // this.$store.mutations.setInformationFromServer(datas)
      context.commit('setInformationFromServer',datas);
      
      console.log(context.getters.getInfoList);
    }))
  }
});
export default actions
