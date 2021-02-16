import Vue from 'vue'
import i18n from '@/i18n'
import Localization from '@it-enterprise/localization'

Vue.use(Localization, { dependencies: { i18n } })

Vue.prototype.$localization.RegisterLanguage('', 'uk', () => import('@/i18n/locales/uk.json'))
Vue.prototype.$localization.RegisterLanguage('', 'en', () => import('@/i18n/locales/en.json'))
Vue.prototype.$localization.RegisterLanguage('', 'zh', () => import('@/i18n/locales/cn.json'))
Vue.prototype.$localization.RegisterLanguage('', 'ru', () => import('@/i18n/locales/ru.json'))
