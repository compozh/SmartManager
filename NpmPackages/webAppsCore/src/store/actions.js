const actions = ({

  /** Загрузить данные для компонента */
  LoadDataForComponent({commit}, {datasource, key}) {

    this._vm.$WebApps.LoadDataForComponent({datasource, key}).then(resp => {
      return commit('setAppData', {key, data: resp.data})
    })
  },

  zzz({commit},{data, key}){
    commit('setAppData', {key, data})
  }



})
export default actions
