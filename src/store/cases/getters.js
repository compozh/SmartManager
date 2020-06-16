export default {
  cases (state, getters, rootState) {
    const cases = state.cases
    const search = rootState.app.search ? rootState.app.search.trim() : ''
    // Определение необходимость поиска/фильтрации кейсов
    if (!search || !cases) {
      return cases || []
    }
    // Список полей, по которым осуществляется поиск
    const searchFields = [
      'id',
      'name',
      'purpose',
      'dateFrom',
      'dateTo',
      'fioAdd',
      'dateAdd'
    ]
    return cases.filter(caseItem => getters.search(caseItem, searchFields, search))
  }
}
