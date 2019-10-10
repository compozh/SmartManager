import { firebase } from '@firebase/app'
import '@firebase/messaging'

import { eventBus } from '@/main'
import registerMobileDevice from '@/api/mobileNotifications/registerMobileDevice.gql'

function isTokenSentToServer() {
  return window.localStorage.getItem('EAMFCMsentToServer') === '1'
}
function setTokenSentToServer(sent) {
  window.localStorage.setItem('EAMFCMsentToServer', sent ? '1' : '0')
}

function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log('Sending FCM token to server...')
    eventBus.$apollo.mutate({
      mutation: registerMobileDevice,
      variables: {
        token: currentToken,
      },
    }).then(() => { setTokenSentToServer(true) })

  } else {
    console.log('FCM Token already sent to server so won\'t send it again unless it changes')
  }
}

export const inicializeFirebase = (registration) => {
  debugger
  const config = {
    apiKey: 'AIzaSyB9C0X6zWOmYtkGyh-nRvI5CPZjsbLtB2A',
    authDomain: 'eamapp-cdb2e.firebaseapp.com',
    databaseURL: 'https://eamapp-cdb2e.firebaseio.com',
    projectId: 'eamapp-cdb2e',
    storageBucket: 'eamapp-cdb2e.appspot.com',
    messagingSenderId: '821491675335',
    appId: '1:821491675335:web:eefe25768f186852'
  }
  firebase.initializeApp(config)

  const messaging = firebase.messaging()

  messaging.usePublicVapidKey('BP0GkrNB0-G9TIAB34kX2fkgyQt0eD04xMYUrBLNrUZ78XPiKzv_avqFfntTe0hV0qudDaz17oXBh3R-nIXMLDU')

  // Request Permission of Notifications
  messaging.requestPermission().then(() => {
    console.log('Notification permission granted.')
    if (!isTokenSentToServer()) {
      messaging.getToken().then((token) => {
        sendTokenToServer(token)
        console.log(`FCM token: ${token}`)
      })
    }
  }).catch((err) => {
    console.log('Unable to get permission to notify.', err)
  })

  messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
      console.log('Token refreshed.')
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      setTokenSentToServer(false)
      // Send Instance ID token to app server.
      sendTokenToServer(refreshedToken)
    }).catch((err) => {
      console.log('Unable to retrieve refreshed token ', err)
    })
  })

  messaging.useServiceWorker(registration)
}