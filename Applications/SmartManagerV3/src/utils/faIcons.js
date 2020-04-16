import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fal } from '@fortawesome/pro-light-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import FaIcon from '@/components/FaIcon'

// TODO: импорт иконок по названиям

library.add(fal, far)

Vue.component('fa-icon', FaIcon)
