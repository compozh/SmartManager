/*=========================================================================================
  File Name: moduleAuthState.js
  Description: Auth Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

let currentUser

try {
  currentUser =  JSON.parse(localStorage.getItem('currentUser'))
} catch (e) {
  currentUser = undefined
}

export default {
  currentUser,
  isUserLoggedIn: () => {
    return !!localStorage.getItem('currentUser')
  },
}
