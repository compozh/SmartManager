import { firebase } from '@firebase/app'
import '@firebase/messaging'

import { eventBus } from '@/main'
import registerMobileDevice from '@/api/mobileNotifications/registerMobileDevice.gql'
import unRegisterMobileDevice from '@/api/mobileNotifications/unRegisterMobileDevice.gql'

const config = {
  apiKey: 'AIzaSyB9C0X6zWOmYtkGyh-nRvI5CPZjsbLtB2A',
  authDomain: 'eamapp-cdb2e.firebaseapp.com',
  databaseURL: 'https://eamapp-cdb2e.firebaseio.com',
  projectId: 'eamapp-cdb2e',
  storageBucket: 'eamapp-cdb2e.appspot.com',
  messagingSenderId: '821491675335',
  appId: '1:821491675335:web:eefe25768f186852'
}

export function isTokenSentToServer() {
  return window.sessionStorage.getItem('EAMFCMsentToServer') === '1'
}
function setTokenSentToServer(sent) {
  window.sessionStorage.setItem('EAMFCMsentToServer', sent ? '1' : '0')
}

function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer() && eventBus.$store.getters['eam/auth/user']) {
    console.log('Sending FCM token to server...')
    eventBus.$apollo.mutate({
      mutation: registerMobileDevice,
      variables: {
        token: currentToken,
        schema: 'mobilenotifications'
      },
    }).then(() => { setTokenSentToServer(true) })

  } else {
    console.log('FCM Token already sent to server so won\'t send it again unless it changes')
  }
}

export async function unregisterDevice() {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(config)
    }
    if (firebase.messaging.isSupported()) {
      if (isTokenSentToServer()) {
        console.log('Unregistering FCM token...')
        const messaging = firebase.messaging()
        await messaging.getToken().then((token) => {
          if (token) {
            eventBus.$apollo.mutate({
              mutation: unRegisterMobileDevice,
              variables: {
                token: token,
                schema: 'mobilenotifications'
              },
            }).then(() => { setTokenSentToServer(false) })
            console.log(`FCM token unregistered: ${token}`)
          }
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
}

export async function registerDevice() {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(config)
    }
    if (firebase.messaging.isSupported()) {
      if (!isTokenSentToServer()) {
        console.log('Registering FCM token...')
        const messaging = firebase.messaging()
        await messaging.getToken().then((token) => {
          if (token) {
            sendTokenToServer(token)
            console.log(`FCM token registered: ${token}`)
          }
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
}

export const inicializeFirebase = (registration) => {
  firebase.initializeApp(config)

  if (firebase.messaging.isSupported()) {
    const messaging = firebase.messaging()

    messaging.usePublicVapidKey('BP0GkrNB0-G9TIAB34kX2fkgyQt0eD04xMYUrBLNrUZ78XPiKzv_avqFfntTe0hV0qudDaz17oXBh3R-nIXMLDU')

    // Request Permission of Notifications
    messaging.requestPermission().then(() => {
      console.log('Notification permission granted.')
      if (!isTokenSentToServer() && eventBus.$store.getters['eam/notifications']) {
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
        if (eventBus.$store.getters['eam/notifications']) {
          sendTokenToServer(refreshedToken)
        }
      }).catch((err) => {
        console.log('Unable to retrieve refreshed token ', err)
      })
    })

    messaging.useServiceWorker(registration)
  }
}