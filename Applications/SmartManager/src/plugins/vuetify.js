import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

// Translation provided by Vuetify (javascript)
import en from 'vuetify/es5/locale/en'
import ru from 'vuetify/es5/locale/ru'
import uk from 'vuetify/es5/locale/uk'

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
    locales: { en, ru, uk },
    current: localStorage.getItem('language') || 'en'
  },
  icons: {
    iconfont: 'fa'
  }
})
