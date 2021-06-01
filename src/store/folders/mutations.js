export default {
  SET_FOLDERS (state, folders) {
    state.folderGroups = folders
  },
  SET_ACTIVE_FOLDER (state, { folderId }) {
    state.activeFolderId = folderId
  },
  CHANGE_TASKS_COUNT (state, folderId) {
    const taskFolders = state.folderGroups.taskFolders
    const folder = taskFolders.find(folder => folder.Code === folderId)
    if (folder) folder.Count -= 1
  }
}
