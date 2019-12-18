export default {
  UPDATE_AUTHENTICATED_USER(state, user) {
    state.user = user
  },
  setMessage(state, payload) {
    state.message = payload ? payload : {}
  },
  setTaskAddForm(state, payload) {
    state.taskAddForm = payload
  },
  setFolders(state, payload) {
    state.folders = payload.sort(i => i.code === '' ? -1 : 0 )
  },
  setCurrentFolder(state, payload) {
    state.currentFolder = payload
  },
  setTasks(state, payload) {
    state.tasks = Object.assign({}, state.tasks, payload)
  },
  setTaskInfo(state, payload) {
    state.taskInfo = Object.assign({}, state.taskInfo, payload)
  },
  setFileUrl(state, {fileId, fileUrl, taskOrCaseId: id}) {
    const task = state.taskInfo[id]
      || state.caseDetails[id]
    task.originals.forEach(original => {
      if (original.id === fileId) {
        original.fileUrl = fileUrl
      }
    })
  },
  setSearch(state, payload) {
    state.search = payload
  },
  setUsers(state, payload) {
    state.users = payload
  },
  setCases(state, payload) {
    state.cases = payload
  },
  setCaseDetails(state, payload) {
    state.caseDetails = Object.assign({}, state.caseDetails, payload)
  },
  setBusinessProcesses(state, payload) {
    state.businessProcesses = payload
  },
  setTaskListPosition(state, {folder, page, scrollTop}) {
    if (!state.taskListPosition[folder]) {
      state.taskListPosition = Object
        .assign({}, state.taskListPosition, {
          [folder]: {page: 1, scrollTop: 0}
        })
    }
    state.taskListPosition[folder] = Object
      .assign({}, state.taskListPosition[folder], {
        page: page || state.taskListPosition[folder].page,
        scrollTop: scrollTop || state.taskListPosition[folder].scrollTop
      })
  }
}
