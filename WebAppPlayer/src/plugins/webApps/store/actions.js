const actions = ({

  /** Загрузить данные для компонента */
  LoadDataForComponent({commit}, {datasource, key}) {


    return Axios({
      method: 'POST',
      url: myConfig.GrapgQlUrl + 'api/graphql',
      withCredentials: true,
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')},
      data: {SchemaName: datasource.schema, query: datasource.query}
    }).then(resp => {
      return commit('setAppData', {key, data: resp.data})
      //console.log(resp.data)
    })
  }

})
export default actions
