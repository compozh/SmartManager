/*=========================================================================================
  File Name: smStore.js
  Description: Smart Manager App Store
==========================================================================================*/

import actions from './smActions'
import getters from './smGetters'
import mutations from './smMutations'
import state from './smState'

export default {
  namespaced: true,
  namespace: 'sm',
  actions,
  getters,
  mutations,
  state
}
