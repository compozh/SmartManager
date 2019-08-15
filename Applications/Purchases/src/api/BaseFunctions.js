import Axios from 'axios'
import Vue from 'vue'

export default function purchasesSchemaAxios (f, q, props) {
  f.loading = true
  const authHeader =  Vue.prototype.$authentication.getAuthHeader()

  // Simulated ajax query
  clearTimeout(f.timeout)
  return new Promise((resolve) => {
        
    f.timeout = setTimeout(() => {
      Axios({
        method: 'POST',
        url: window.myConfig.GrapgQlUrl + 'api/graphql',
        withCredentials: true,
        headers: { 
          ...authHeader//
          // 'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken'), 'Content-Type': 'application/json'
        },
        data: { 
          SchemaName: 'PurchasesSchema', 
          query: q,
          variables: props
        } 
      })
        .then(res => { f.loading = false; resolve(res) })
        
    }, 0)
  })
}