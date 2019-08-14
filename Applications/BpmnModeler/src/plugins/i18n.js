import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: localStorage.getItem('language') ? localStorage.getItem('language') : 'ru', //дефолтный
  fallbackLocale: 'ru', //если не загрузился язык, то ru

})
