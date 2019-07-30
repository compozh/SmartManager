export default {
  circularLoader(state) {
    return state.circularLoader
  },
  linearLoader(state) {
    return state.linearLoader
  },
  error(state) {
    return state.error
  },
  getProperties(state) {
    return state.properties
  },
  getWorkCenters(state) {
    return state.workCenters
  },
  shiftTasks(state) {
    const search = state.search ? state.search.trim() : ''

    // Список полей, по которым осуществляется поиск
    const searchFields = [
      'workCenter'
    ]
    return state.shifTasks.filter(task => {
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
  menuMiniMode(state, commit) {
    if (state.menuMiniMode === null) {
      state.menuMiniMode = localStorage.getItem("mesMenuMiniMode") === 'true';
    }
    return state.menuMiniMode;
  },
}