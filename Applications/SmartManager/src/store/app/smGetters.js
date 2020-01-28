export default {
  tasks(state) {
    const folderId = state.currentFolder
    const tasks = state.tasks[folderId]
    const search = state.search ? state.search.trim() : ''
    // Определение необходимость поиска/фильтрации задач
    if (!search || !tasks) {
      return tasks
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
    return tasks.filter(task => {
      // Цикл for по ключам задачи для возможности использовать continue
      for (let i = 0; i < searchFields.length; i++) {
        let searchField = searchFields[i]
        let taskField = task[searchField]
        // Если такого поля нет - пропуск без проверки
        if (!taskField) {
          continue
        }
        let taskFieldValue = String(taskField).toLowerCase()
        let isMatching = taskFieldValue.includes(search.toLowerCase())
        // При первом же совпадении отбор и переход к следующей задаче
        if (isMatching) {
          return true
        }
      }
    })
  },
  cases(state) {
    const cases = state.cases
    const search = state.search ? state.search.trim() : ''
    // Определение необходимость поиска/фильтрации кейсов
    if (!search || !cases) {
      return cases
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
    return cases.filter(item => {
      // Цикл for по ключам задачи для возможности использовать continue
      for (let i = 0; i < searchFields.length; i++) {
        let searchField = searchFields[i]
        let caseField = item[searchField]
        // Если такого поля нет - пропуск без проверки
        if (!caseField) {
          continue
        }
        let taskFieldValue = String(caseField).toLowerCase()
        let isMatching = taskFieldValue.includes(search.toLowerCase())
        // При первом же совпадении отбор и переход к следующей задаче
        if (isMatching) {
          return true
        }
      }
    })
  }
}
