export default {
  SET_AUTH_TYPES (state, authTypes) {
    state.authTypes = authTypes.split(',')
  },
  UPDATE_AUTHENTICATED_USER (state, user) {
    state.user = user
  },
  UPDATE_DELEGATED_RIGHTS (state, { mode, id, dateFrom, dateTo, comm }) {
    if (mode === 'DELETE') {
      state.user.delegatedRights = state.user.delegatedRights.filter(i => i.ID !== id)
    }
    if (mode === 'EDIT') {
      const rights = state.user.delegatedRights.find(i => i.ID !== id)
      rights.DATEFROM = dateFrom
      rights.DATETO = dateTo
      rights.COMM = comm
    }
  }
}
