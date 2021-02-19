import Vue from 'vue'
import Vuetify from 'vuetify'

// Translation provided by Vuetify (javascript)
import uk from 'vuetify/es5/locale/uk'
import en from 'vuetify/es5/locale/en'
import ru from 'vuetify/es5/locale/ru'
import zh from 'vuetify/es5/locale/zh-Hans'

Vue.use(Vuetify)

export default new Vuetify({
  rtl: Boolean(window.appConfig.rtl),
  theme: {
    themes: {
      light: {
        primary: '#42A5F6'
      }
    }
  },
  lang: {
    locales: { en, ru, uk, zh },
    current: localStorage.getItem('language') || 'uk'
  },
  icons: {
    iconfont: 'fa'
  }
})
