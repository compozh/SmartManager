/* eslint-disable no-console */
import {register} from 'register-service-worker'

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.'
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated(registration) {
      console.log('New content is available and will be refresh.')
      if (window.confirm('A new version is available, update now?')) {
        const worker = registration.waiting
        worker.postMessage({ action: 'SKIP_WAITING' })
      }
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })
  let refreshing
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) {
      return
    }
    window.location.reload()
    refreshing = true
  })
} else {
  console.log('Your browser does not support the Service-Worker!')
}
