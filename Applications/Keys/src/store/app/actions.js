import {KeysApi} from '@/api/keysApi.js'
export default {
  /** Загрузить список документов по датам */
  loadDocuments({state, commit}) {

    return KeysApi.getDocuments(state.filter.dateFrom, state.filter.dateTo).then(response => {
      commit('setDocuments', response.data.keysQuery.documents)
    })
  },

  /** Загрузить детальное описание одного документа */
  loadDocumentDetails({ commit }, documentId) {
    commit('setDocumentDetails', undefined)
    return KeysApi.getDocument(documentId).then(response => {
      commit('setDocumentDetails', response.data.keysQuery.document)
    })
  },

  /** Установить фильтр отбора документов */
  setFilter({dispatch, commit}, filter) {
    commit('setFilter', filter)
    dispatch('loadDocuments')
  },

  /** Создать документ */
  addDocument({ commit }, parameters) {
    return KeysApi.createDocument(parameters).then( resp => {
      let document = resp.data.keysQueryMutation.createDocument
      commit('addCreatedDocument', document)
      return document
    })
  },

  /** Удалить документ */
  deleteDocument({ commit }, id) {
    return KeysApi.deleteDocument(id).then(resp => {
      let result = resp.data.keysQueryMutation.deleteDocument
      if (result) {
        commit('deleteDocument', id)
      }
      return result
    })
  }
}
