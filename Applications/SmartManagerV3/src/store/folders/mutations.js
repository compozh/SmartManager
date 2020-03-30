export default {
  SET_FOLDERS (state, folders) {
    state.folderGroups = folders
  },
  SET_ACTIVE_FOLDER (state, { folderId }) {
    state.activeFolderId = folderId
  }
}
