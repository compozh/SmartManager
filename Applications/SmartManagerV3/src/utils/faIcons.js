import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fal } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// TODO: иконки по типам

library.add(fal)

Vue.component('fa-icon', FontAwesomeIcon)
