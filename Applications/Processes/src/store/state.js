import auth from '@it-enterprise/jwtauthentication'

export default {
  snackbar: {
    type: 'error', // error / success
    message: '',
    visible: false
  },
  processes: [],
  user: auth.getUserData()
}
