/*=========================================================================================
  File Name: globalComponents.js
  Description: Here you can register components globally
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import VxTooltip from './layouts/components/vx-tooltip/VxTooltip.vue'
import VxCard  from './components/vx-card/VxCard.vue'
import VxList  from './components/vx-list/VxList.vue'
import VxBreadcrumb  from './layouts/components/VxBreadcrumb.vue'
import FeatherIcon  from './components/FeatherIcon.vue'
import VxInputGroup  from './components/vx-input-group/VxInputGroup.vue'
import titleComponent from './components/DocTitle'

Vue.component('doc-title', titleComponent)
Vue.component(VxTooltip.name, VxTooltip)
Vue.component(VxCard.name, VxCard)
Vue.component(VxList.name, VxList)
Vue.component(VxBreadcrumb.name, VxBreadcrumb)
Vue.component(FeatherIcon.name, FeatherIcon)
Vue.component(VxInputGroup.name, VxInputGroup)

import './views/account-personal-info/main'

Vue.component('nabu-traning-schedule', () => import('./views/nabu-pages/nabu-traning-schedule.vue'))
Vue.component('nabu-additional-training', () => import('./views/nabu-pages/nabu-additional-training.vue'))
Vue.component('nabu-curriculum', () => import('./views/nabu-pages/nabu-curriculum.vue'))
Vue.component('nabu-learning', () => import('./views/nabu-pages/nabu-learning.vue'))
Vue.component('nabu-strategic-goals', () => import('./views/nabu-pages/nabu-strategic-goals.vue'))
Vue.component('nabu-tasks-for-year', () => import('./views/nabu-pages/nabu-tasks-for-year.vue'))
Vue.component('nabu-results-interim-evaluation', () => import('./views/nabu-pages/nabu-results-interim-evaluation.vue'))
Vue.component('nabu-criterial-evaluation', () => import('./views/nabu-pages/nabu-criterial-evaluation.vue'))
Vue.component('nabu-self-esteem-results', () => import('./views/nabu-pages/nabu-self-esteem-results.vue'))
Vue.component('nabu-results-assessment-supremo', () => import('./views/nabu-pages/nabu-results-assessment-supremo.vue'))




// v-select component
import vSelect from 'vue-select'

// Set the components prop default to return our fresh components
vSelect.props.components.default = () => ({
  Deselect: {
    render: createElement => createElement('feather-icon', {
      props: {
        icon: 'XIcon',
        svgClasses: 'w-4 h-4 mt-1'
      }
    }),
  },
  OpenIndicator: {
    render: createElement => createElement('feather-icon', {
      props: {
        icon: 'ChevronDownIcon',
        svgClasses: 'w-5 h-5'
      }
    }),
  },
})

Vue.component(vSelect)
