/* eslint-disable no-console */

import {register} from 'register-service-worker'

const notifyUserAboutUpdate = worker => {
  // Здесь можно добавить уведомление для пользователя
  // о доступности обновлений контента
  worker.postMessage({action: 'skipWaiting'})
}

if (process.env.NODE_ENV === 'production') {
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
      notifyUserAboutUpdate(registration.waiting)
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
}
