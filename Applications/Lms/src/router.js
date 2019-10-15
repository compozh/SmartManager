import Vue from 'vue'
import VueRouter from 'vue-router'
//import Authentication from '@it-enterprise/authentication'
Vue.use(VueRouter)
//Vue.use(Authentication, { options: window.myConfig, dependencies })

// Новый роутер.
// Переход по ссылке:
// => Домашняя страница - без аутентификации
// Навигация:
// * клик по карточке => аутентификация => переход на страницу курса/модуля
// * кнопка "Начать обучение" => аутентификация => "Курсы"
// * "Курсы" => аутентификация => страница курсов
// * "Модули" => аутентификация => страница модулей
// * "Поиск" => страница поск курсов
// ------------------------------------------------------

// const router = new VueRouter({
//   mode: 'history',
//   scrollBehavior(to, from, savePosition) {
//     if (savePosition) {
//       return savePosition
//     } else {
//       return { x: 0, y: 0 }
//     }
//   },
//   base: window.myConfig.BASE_URL + 'LMS/',
//   routes: [
//     // ---------------------------
//     // HOME - без аутентификации
//     // ---------------------------
//     {
//       path: '',
//       name: '',
//       component: () => import('./components/LmsLayout.vue'),
//       children: [
//         // --------------------------
//         // Домашняя, Курсы, модули, поиск
//         // --------------------------
//         {
//           path: '/home',
//           name: 'LMSHOME',
//           component: () => import('./components/LmsHome.vue'),
//           meta: { requiresAuth: false}
//         },
//         {
//           path: '/courses',
//           name: 'LMSCOURSES',
//           component: () => import('./components/LmsCourses.vue'),
//           meta: { requiresAuth: true}
//         },
//         {
//           path: '/courses/:courseGuid',
//           name: 'LMSCOURSEDETAILS',
//           component: () => import('./components/LmsCourseDetails.vue'),
//           meta: { requiresAuth: true}
//         },
//         {
//           path: '/modules',
//           name: 'LMSMODULES',
//           component: () => import('./components/LmsModules.vue'),
//           meta: { requiresAuth: true}
//         },
//         {
//           path: '/modules/:moduleGuid',
//           name: 'LMSMODULESDETAILS',
//           component: () => import('./components/LmsModuleDetails.vue'),
//           meta: { requiresAuth: true}
//         },
//         {
//           path: '/search',
//           name: 'LMSSEARCH',
//           component: () => import('./components/LmsSearch.vue'),
//           meta: { requiresAuth: false}
//         },
//         {
//           path: '/modules/:moduleGuid/:lessonGuid',
//           name: 'LMSLESSON',
//           component: () => import('./components/LmsLesson.vue'),
//           meta: { requiresAuth: true}
//         },
//         {
//           path: '*',
//           redirect: '/home'
//         }
//       ],
//       redirect: '',
//       meta: {requiresAuth: false},
//       caseSensitive: false
//     }
//   ]
// })

// router.beforeEach((to, from, next) => {
//   if (to.matches.some(record => record.meta.requiresAuth)) {
//     // Если пользователь аутентифицирован
//     const currentUser = this.$store.currenUser
//     if(currentUser.access_token) {
//       next( {
//         path: '/login',
//         query: {redirect: to.fullPath}
//       })
//     } else {
//       next()
//     }
//   }
//   else {
//     next()
//   }
// })

// router.beforeEach((to, from, next) => {
//   Vue.prototype.$authentication.getCurrentUser().then(currentUSer => {
//     if (
//       to.path === '/login' ||
//       !!currentUSer
//     ) {
//       return next()
//     }
//     router.push({ name: 'login', query: { to: to.path } })
//    })
//  })

// Роутер по умолчанию
export const routerDependencies = {
  router: new VueRouter({
    mode: 'history',
    base: window.myConfig.BASE_URL,
    routes: [{path: '/:ApplicationId', children: [{path: '*'}]}
    ]
  }),
  VueRouter
}

//export default router
