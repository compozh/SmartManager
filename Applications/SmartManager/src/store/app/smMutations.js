import moment from 'moment'

export default {
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
  setSearch(state, payload) {
    state.search = payload
  },
  setUsers(state, payload) {
    state.users = payload
  },
  addComment(state, payload) {
    const user = JSON.parse(localStorage.currentUser)
    const comment = {
      date: moment().format('DD.MM.YYYY HH:mm'),
      text: payload.text,
      user: user.UserData.CurrentUserData.UserName,
      userId: user.UserData.CurrentUserData.UserId,
      userPhoto: user.UserData.CurrentUserData.UserPhoto
    }
    state.taskInfo[payload.id].comments.push(comment)
  },
  setBusinessProcesses(state, payload) {
    state.businessProcesses = payload
  }
}
