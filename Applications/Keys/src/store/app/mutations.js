export default {
  setDocuments(state, documents) {
    state.documents = documents
  },
  setDocumentDetails(state, document) {
    state.documentDetails = document
  },
  setFilter(state, {dateFrom, dateTo}) {
    if (dateFrom) {
      state.filter.dateFrom = dateFrom
    }
    if (dateTo) {
      state.filter.dateTo = dateTo
    }
  },
  setShowAddDocumentForm(state, value) {
    state.showAddDocumentForm = value
  },
  setShowAddDocumentRowForm(state, value) {
    state.showAddDocumentRowForm = value
  },
  addCreatedDocument(state, value) {
    state.documents.push(value)
    state.documents = state.documents.slice()
  },

  deleteDocument(state, id) {
    state.documents = state.documents.filter( d => d.id != id)
  }
}
