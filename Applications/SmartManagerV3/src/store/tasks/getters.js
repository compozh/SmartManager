export default {
  tasks (state, getters) {
    const folderId = getters.activeFolder.Code
    const tasks = state.tasks ? state.tasks[folderId] : null
    const search = state.search ? state.search.trim() : ''
    // Определение необходимость поиска/фильтрации задач
    if (!search || !tasks) {
      return tasks || []
    }
    // Список полей, по которым осуществляется поиск
    const searchFields = [
      'id',
      'addedFio',
      'dateAdd',
      'dateFact',
      'dateplan',
      'declarer',
      'descript',
      'htmlDescript',
      'name',
      'performer'
    ]
    return tasks.filter(task => getters.search(task, searchFields, search))
  }
}
