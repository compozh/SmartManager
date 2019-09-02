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
  }
}
