import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ru from './resources/ru.json'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: localStorage.getItem('language') ? localStorage.getItem('language') : 'ru', //дефолтный
  fallbackLocale: 'ru', //если не загрузился язык, то ru
  messages: {
    ru: {
      test: ru
    }
  }
})
