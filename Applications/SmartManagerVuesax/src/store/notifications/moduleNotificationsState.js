/* ================================================================
  File Name: moduleNotificationsState.js
  Description: Модуль уведомлений. Состояние
================================================================ */

export default {
  unreadNotifications: [
    { index: 0, title: 'New Message', msg: 'Are your going to meet me tonight?', icon: 'MessageSquareIcon', time: randomDate({sec: 10}), category: 'primary' },
    { index: 1, title: 'New Order Recieved', msg: 'You got new order of goods.', icon: 'PackageIcon', time: randomDate({sec: 40}), category: 'success' },
    { index: 2, title: 'Server Limit Reached!', msg: 'Server have 99% CPU usage.', icon: 'AlertOctagonIcon', time: randomDate({min: 1}), category: 'danger' },
    { index: 3, title: 'New Mail From Peter', msg: 'Cake sesame snaps cupcake', icon: 'MailIcon', time: randomDate({min: 6}), category: 'primary' },
    { index: 4, title: 'Bruce\'s Party', msg: 'Chocolate cake oat cake tiramisu', icon: 'CalendarIcon', time: randomDate({hr: 2}), category: 'warning' },
    { index: 5, title: 'New Message', msg: 'Are your going to meet me tonight?', icon: 'MessageSquareIcon', time: randomDate({sec: 10}), category: 'primary' },
    { index: 6, title: 'New Order Recieved', msg: 'You got new order of goods.', icon: 'PackageIcon', time: randomDate({sec: 40}), category: 'success' },
    { index: 7, title: 'Server Limit Reached!', msg: 'Server have 99% CPU usage.', icon: 'AlertOctagonIcon', time: randomDate({min: 1}), category: 'danger' },
    { index: 8, title: 'New Mail From Peter', msg: 'Cake sesame snaps cupcake', icon: 'MailIcon', time: randomDate({min: 6}), category: 'primary' },
    { index: 9, title: 'Bruce\'s Party', msg: 'Chocolate cake oat cake tiramisu', icon: 'CalendarIcon', time: randomDate({hr: 2}), category: 'warning' }
  ]
}


// Method for creating dummy notification time
function randomDate({hr, min, sec}) {
  let date = new Date()

  if (hr) { date.setHours(date.getHours() - hr) }
  if (min) { date.setMinutes(date.getMinutes() - min) }
  if (sec) { date.setSeconds(date.getSeconds() - sec) }

  return date
}
