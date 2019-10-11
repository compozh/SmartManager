/* eslint-disable no-console */

import { register } from 'register-service-worker'
import { inicializeFirebase } from '@/push-notification'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered(registration) {
      console.log('Service worker has been registered.')
      inicializeFirebase(registration)
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated() {
      console.log('New content is available; please refresh.')
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })

  window.addEventListener('load', () => {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (!event.data) {
        return
      }

      switch (event.data) {
      case 'reload-window':
        window.location.reload()
        break
      default:
        break
      }
    })
  })
}
