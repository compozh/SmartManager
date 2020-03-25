export default {
  appParams: state => state.applicationParams || {},
  search: () => (item, searchFields, value) => {
    for (let i = 0; i < searchFields.length; i++) {
      const searchField = searchFields[i]
      const taskField = item[searchField]
      // Если такого поля нет - пропуск без проверки
      if (!taskField) {
        continue
      }
      const taskFieldValue = String(taskField).toLowerCase()
      const isMatching = taskFieldValue.includes(value.toLowerCase())
      // При первом же совпадении отбор и переход к следующей задаче
      if (isMatching) {
        return true
      }
    }
  },
  folders: state => state.folders || [],
  taskFolders: (state, getters) => {
    const folders = [...(getters.folders.taskFolders || [])]
    return folders.sort(i => i.Code === 'active' ? -1 : 0)
  },
  caseFolders: (state, getters) => getters.folders.caseFolders || [],
  filters: (state, getters) => getters.folders.filters || [],
  allFolders: (state, getters) => [
    ...getters.taskFolders,
    ...getters.caseFolders,
    ...getters.filters
  ],
  activeFolder: (state, getters) => {
    return getters.allFolders.find(folder => {
      return folder.Code === state.activeFolderId
    }) || {}
  }
}
