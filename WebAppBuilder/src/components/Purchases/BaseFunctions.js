import Axios from "axios";

export default function purchasesSchemaAxios (f, q, props) {
    f.loading = true
    // Simulated ajax query
    clearTimeout(f.timeout);
    return new Promise((resolve) => {
        
      f.timeout = setTimeout(() => {
        Axios({
                            method: 'POST',
                            url: myConfig.GrapgQlUrl+'api/graphql',
                            withCredentials:true,
                            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')},
                            data: { 
                              SchemaName:'PurchasesSchema', 
                              query: q,
                              props: props
                            } 
                          })
        .then(res=> { f.loading = false; resolve(res) });
        
      }, 0)
    });
  }