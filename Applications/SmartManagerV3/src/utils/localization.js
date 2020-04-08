import Vue from 'vue'
import i18n from '@/i18n'

// Реализация метода регистрации файлов локализации для пакета it-enterprise/formio
// ...имитация логики пакета it-enterprise/localization
const localization = {
  __i18n: i18n,
  RegisterLanguage (namespace, lang, getMessagePromise) {
    // TODO: add formio messages to i18n
  }
}

Object.defineProperty(Vue.prototype, '$localization', {
  get: () => localization
})
