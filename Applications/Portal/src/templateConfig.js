export default {
  applicationTitle: 'Личный кабинет',
  // доступные локализации
  localizations: [
    { code: 'uk', name: 'Українська',  flag: 'ua' },
    { code: 'ru', name: 'Русский',  flag: 'ru' },
    { code: 'en', name: 'English',  flag: 'us' },
  ],
  login: {
    // Возможные варианты: ['google', 'facebook', 'twitter', 'github']
    allowedAlternativeLoginMethods: [],
    allowedRegisterUser: false
  }
}
