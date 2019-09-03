export default {
  setCircularLoader(state, payload) {
    state.circularLoader = payload
  },
  setLinearLoader(state, payload) {
    state.linearLoader = payload
  },
  setMessage(state, payload) {
    state.message = payload ? payload : {}
  },
  setMenuMode(state, payload) {
    state.menuMode.lastState = state.menuMode.currentState
    state.menuMode.currentState = payload
  },
  setTaskAddForm(state, payload) {
    if (payload === 'close') {
      state.menuMode.currentState = state.menuMode.lastState
    }
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
    state.taskInfo = payload
  },
  setSearch(state, payload) {
    state.search = payload
  },
  setUsers(state, payload) {
    state.users = payload
  },
  addComment(state, payload) {
    const user = JSON.parse(localStorage.currentUser)
    const date = new Date().toLocaleString('ru', {
      year: 'numeric', month: 'numeric', day: 'numeric'
    })
    const time = new Date().toLocaleString('ru', {
      hour: 'numeric', minute: 'numeric'
    })
    const comment = {
      date: `${date} ${time}`,
      text: payload,
      user: user.UserData.CurrentUserData.UserName,
      userPhoto: user.UserData.CurrentUserData.UserPhoto
    }
    state.taskInfo.comments.push(comment)
  }
}
