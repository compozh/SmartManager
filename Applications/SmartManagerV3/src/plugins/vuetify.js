import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import cookies from 'vue-cookies'

// Translation provided by Vuetify (javascript)
import en from 'vuetify/es5/locale/en'
import ru from 'vuetify/es5/locale/ru'
import uk from 'vuetify/es5/locale/uk'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { en, ru, uk },
    current: localStorage.getItem('lang') || cookies.get('c') || 'en'
  },
  icons: {
    iconfont: 'fa'
  }
})
