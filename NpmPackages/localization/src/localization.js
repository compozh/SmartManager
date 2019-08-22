import cookies from 'vue-cookies'
export default class Localization {

  __i18n = undefined
  // загруженные локализации
  __loadedLanguages = {}
  // зарегистрированные локализации
  __registeredLanguages = {}

  constructor (dependencies) {
    this.__i18n = dependencies.i18n

    if(!this.__i18n){
      throw new Error('i18n должен быть передан в виде зависимости!')
    }

    this.__i18n.locale = localStorage.getItem('language') ? localStorage.getItem('language') : 'ru', //дефолтный

    this.__loadedLanguages[(this.__i18n.fallbackLocale || this.__i18n.locale)] = true

  }

  /**
   * Зарегистрировать пакет локализации
   * @param {String} namespace Пространство имён
   * @param {String} lang Язык
   * @param {Function} getMessagePromise Функция, возвращающая Promise загрузки ресурсов
   */
  RegisterLanguage(namespace, lang, getMessagePromise){
    if(!this.__registeredLanguages[lang]){
      this.__registeredLanguages[lang] = {}
    }
    this.__registeredLanguages[lang][namespace] = getMessagePromise


    if(this.__loadedLanguages[lang]){
      this.__loadedLanguages[lang] = undefined
      this._loadLanguageAsync(lang)
    }

  }

  SetLocalization(lang){
    if (this.__i18n.locale == lang) {
      return Promise.resolve(lang)

    }
    this._loadLanguageAsync(lang)
  }

  _loadLanguageAsync(lang){
    if (this.__loadedLanguages[lang] || !this.__registeredLanguages[lang]) {
      return Promise.resolve(this.SetLanguage(lang))
    }
    let promises = []

    for (const key in this.__registeredLanguages[lang]) {
      if (this.__registeredLanguages[lang].hasOwnProperty(key)) {
        const getPromise = this.__registeredLanguages[lang][key]
        promises.push(getPromise().then(response => ({ namespace: key, messages: response.default })))
      }
    }

    Promise.all(promises).then(responses=>{

      let summaryMessages = {}
      responses.forEach( v => {
        summaryMessages[v.namespace] = v.messages
      })

      this.__i18n.setLocaleMessage(lang, summaryMessages)
      this.__loadedLanguages[lang] = true
      return this.SetLanguage(lang)
    })
  }


  SetLanguage(lang) {
    this.__i18n.locale = lang
    cookies.set('c', lang)
    localStorage.setItem('language', lang)
    document.querySelector('html').setAttribute('lang', lang)
    return lang
  }
}
