export default {
  filter: {
    dateFrom: new Date((new Date()).setMonth(new Date().getMonth() - 1)),
    dateTo: new Date()
  },
  documents: []

}
