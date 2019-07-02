import axios from 'axios'
export default {
  getIdForSign(){
    let url =  myConfig.WsUrl + '_MINFIN/GET_ID_FOR_SIGN'
    return axios.get(url).then(resp => {
      return resp.data
    })
  },


  authBySign(requestId, signBase64, budgetId, exchequerId){
    let url = `${myConfig.WsUrl}_MINFIN/AUTH_BY_SIGN/`
    return axios.post(url,{
        requestId,
        signBase64,
        budgetId,
        exchequerId
    }).then(resp => {
      return resp.data
    })

  },

  changeUSerInfo(email, phone, Ticket){
    let url = `${myConfig.WsUrl}_MINFIN/CHANGE_USER_INFO/`
    return axios.post(url,{
        phone,
        email
    }, {
      headers:{ Ticket }
    }).then(resp => {
      return resp.data
    })
  },

  pingTiket(Ticket){
    let url = `${myConfig.WsUrl}PING_AUTH`
    return axios.post(url,undefined, {
      headers:{ Ticket }
    }).then(resp => {
      return resp.data
    })
  }


}