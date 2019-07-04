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
  folders(state) {
    return state.folders
  },
  tasks(state) {
    const folderId = state.currentFolder
    const tasks = state.tasks[folderId]
    const search = state.search ? state.search.trim() : ''

    if (!search || !tasks) {
      return tasks
    }
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
      for (let i = 0; i < searchFields.length; i++) {
        let searchField = searchFields[i]
        let taskField = task[searchField]

        if (!taskField) {
          continue
        }
        let taskFieldValue = String(taskField).toLowerCase()
        let isMatching = taskFieldValue.includes(search.toLowerCase())
        if (isMatching) {
          return true
        }
      }
    })
  },
  taskInfo(state) {
    return state.taskInfo
  }
}