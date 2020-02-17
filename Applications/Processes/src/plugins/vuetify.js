import Vue from 'vue'
import Vuetify from 'vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'
import en from 'vuetify/es5/locale/en.js'
import ru from 'vuetify/es5/locale/ru.js'
import uk from 'vuetify/es5/locale/uk.js'
import { currentLang } from './i18n'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    light: true,
    breakpoint: {
      thresholds: {
        xs: 340,
        sm: 540,
        md: 800,
        lg: 1280,
        xl: 1920
      },
      scrollBarWidth: 24
    }
  },
  lang: {
    locales: { en, ru, uk },
    current: currentLang()
  },
  icons: {
    iconfont: 'md'
  }
})
