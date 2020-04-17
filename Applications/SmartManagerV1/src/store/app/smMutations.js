export default {
  setApplicationParams(state, params) {
    state.applicationParams = JSON.parse(params)
  },
  setFolders(state, folders) {
    state.folders = folders
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
  setHelperExec(state, payload) {
    state.helperExec = payload
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
