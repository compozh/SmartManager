const actions = ({

  /** Загрузить данные для компонента */
  LoadDataForComponent({commit}, {datasource, key}) {

    return  this._vm.$WebApps.LoadDataForComponent({datasource, key}).then(resp => {
      return commit('setAppData', {key, data: resp.data})
    })
  }
})
export default actions
