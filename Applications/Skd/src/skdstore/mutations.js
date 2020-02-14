var moment = require('moment')
import 'moment/locale/ru'
export default {
  UPDATE_AUTHENTICATED_USER(state, user) {
    state.user = user
  },
  changeSort (state) {
    if (state.sort === 0) {
      state.sort = 1
      localStorage.setItem('sorting',1)
      return
    }
    state.sort = 0
    localStorage.setItem('sorting',0)
  },
  setUsers(state, payload) {
    state.users = payload.skd
  },
  setMessage(state, payload) {
    state.message = payload ? payload : {}
  },
  setUsersList (state, payload) {
    payload.forEach( u => {
      u.DateTime = new Date(u.movementDate)
      if (u.DateTime.getFullYear() == 1) {
        u.DateTimeText = ''
        u.IsAbsend = true
        return
      }
      u.IsGone = u.placeName === 'Улица'
      u.IsAbsend = u.placeName === 'Отсутствует в офисе'
      u.DateTimeText =  {
        Today: moment(u.DateTime).format('D MMM YYYY') === moment().format('D MMM YYYY'),
        Day: moment(u.DateTime).format('D MMM YYYY') == moment(new Date()).add(-1,'days').format('D MMM YYYY') ? 'вчера' : moment(u.DateTime).format('dddd'),
        Date: moment(u.DateTime).format('D MMM YYYY'),
        Time: moment(u.DateTime).format('HH:mm'),
      }
    })
    state.users = payload
    state.loaded = true
  },
  setItemsOffset(state, count) {
    state.itemsOffset += count
  },
  resetItemsOffset(state) {
    state.itemsOffset = 20
    window.scrollTo(0,0)
  },
  setFilter (state, filter) {
    filter = filter || ''
    localStorage.setItem('filter',filter)
    state.filter = filter
  },
  changeGrouping(state, value) {
    state.grouping = value
    localStorage.setItem('grouping',value)
  },
  setDrawer(state, value) {
    state.drawer = value
  },
  setLastUpdatedDataTime(state) {
    var dateTime = {
      Date: moment().format('DD-MM-YYYY'),
      Time: moment().format('HH:mm'),
    }
    state.lastUpdatedDateTime = dateTime
  },
  setLoginStatus(state, value) {
    state.loginStatus = value
  },
  setUserDataItemSelected(state, value) {
    state.userDataItemSelected = value
  }
}
