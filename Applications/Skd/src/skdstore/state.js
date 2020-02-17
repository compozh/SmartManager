import auth from '@it-enterprise/jwtauthentication'

export default {
  message: {}, // Snackbar for messages
  itemsOffset: 20,
  filter: localStorage.getItem('filter') || '',
  users: [],
  grouping: localStorage.getItem('grouping') || 0,
  user: auth.getUserData(),
  sort: localStorage.getItem('sorting') || 0,
  drawer: false,
  loginStatus: {},
  lastUpdatedDateTime: {},
  userDataItemSelected: false
}
