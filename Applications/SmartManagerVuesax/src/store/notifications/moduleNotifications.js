/* ================================================================
  File Name: moduleNotifications.js
  Description: Модуль уведомлений
================================================================ */


import state from './moduleNotificationsState.js'
import mutations from './moduleNotificationsMutations.js'
import actions from './moduleNotificationsActions.js'
import getters from './moduleNotificationsGetters.js'

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}
