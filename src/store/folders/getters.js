export default {
  folders: state => state.folderGroups || {},
  taskFolders: (state, getters) => {
    const folders = [...(getters.folders.taskFolders || [])]
    return folders.sort(i => i.Code === 'active' ? -1 : 0)
  },
  caseFolders: (state, getters) => {
    const folders = [...(getters.folders.caseFolders || [])]
    return folders.sort(i => i.Code === 'all' ? -1 : 0)
  },
  filters: (state, getters) => getters.folders.filters || [],
  allFolders: (state, getters) => [
    ...getters.taskFolders,
    ...getters.caseFolders,
    ...getters.filters
  ],
  activeFolder: (state, getters) => {
    return getters.allFolders.find(folder => {
      return String(folder.Code) === String(state.activeFolderId)
    }) || {}
  }
}
