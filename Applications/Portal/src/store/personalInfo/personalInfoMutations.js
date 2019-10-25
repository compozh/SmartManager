import moment from 'moment'
export default {
  setFullUserInfo(state, fullInfo) {
    state.fullUserInfo = fullInfo
  },
  setEditMode(state, value) {
    state.userInfoEditMode = value
  },
  setEmployeeInfo(state, value) {
    value.birthDate =  moment(value.birthDate ).format('DD.MM.YYYY')
    state.employeeInfo = value
  },
}
