import axios from 'axios'
export default {
  getIdForSign(){
    let url =  myConfig.WsUrl + 'MINFIN/GET_ID_FOR_SIGN'
    return axios.get(url).then(resp => {
      return resp.data
    })
  },


  authBySign(requestId, signBase64, budgetId, exchequerId){
    let url = `${myConfig.WsUrl}MINFIN/AUTH_BY_SIGN/`
    return axios.post(url,{
        requestId,
        signBase64,
        budgetId,
        exchequerId
    }).then(resp => {
      return resp.data
    })

  }
}