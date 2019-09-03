export default {
  applicationTitle: 'Smart Manager',
  // доступные локализации
  localizations: [
    { code: 'uk', name: 'Українська',  flag: 'ua' },
    { code: 'ru', name: 'Русский',  flag: 'ru' },
    { code: 'en', name: 'English',  flag: 'us' },
  ],
  login: {
    // Возможные варианты: ['google', 'facebook', 'twitter', 'github']
    allowedAlternativeLoginMethods: ['google', 'facebook', 'twitter', 'github'],
    allowedRegisterUser: false
  }
}
