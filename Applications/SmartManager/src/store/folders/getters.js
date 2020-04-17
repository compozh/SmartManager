export default {
  folders: state => state.folderGroups || {},
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
