import Vue from 'vue'
import Vuetify from 'vuetify'

// Translation provided by Vuetify (javascript)
import en from 'vuetify/es5/locale/en'
import ru from 'vuetify/es5/locale/ru'
import uk from 'vuetify/es5/locale/uk'
import zh from 'vuetify/es5/locale/zh-Hans'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#42A5F6'
      }
    }
  },
  lang: {
    locales: { en, ru, uk, zh },
    current: localStorage.getItem('language') || 'en'
  },
  icons: {
    iconfont: 'fa'
  }
})
