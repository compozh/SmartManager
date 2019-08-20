// var moment = require('moment')
import 'moment/locale/ru'
export default {
  csetMessage(state, payload) {
    state.message = payload ? payload : {}
  },
  setITPortal(state, payload) {
    state.itPortalMenu = payload
  }

}