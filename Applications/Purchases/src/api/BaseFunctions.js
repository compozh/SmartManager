import Axios from 'axios'

export default function purchasesSchemaAxios (f, q, props) {
  f.loading = true
  // Simulated ajax query
  clearTimeout(f.timeout)
  return new Promise((resolve) => {
    console.log(12312)
    f.timeout = setTimeout(() => {
      Axios({
        method: 'POST',
        url: window.myConfig.GrapgQlUrl + 'api/graphql',
        withCredentials: true,
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken'), 'Content-Type': 'application/json'},
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