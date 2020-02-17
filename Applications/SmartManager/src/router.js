import Vue from 'vue'
import auth from '@it-enterprise/jwtauthentication'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

let router = new VueRouter({
  mode: 'history',
  base: window.appConfig.BASE_URL + 'SmartManager/',
  routes: [
    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: '',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        {
          path: '/',
          redirect: '/tasks/active'
        },
        {
          path: '/tasks/:folderId',
          name: 'task-list',
          component: () => import('./views/task-list/TaskList.vue'),
          meta: {
            breadcrumb: ['taskFolder']
          }
        },
        {
          path: '/task/:taskId',
          name: 'task-view',
          redirect: '/task/:taskId/details',
          component: () => import('./views/task-view/TaskView.vue'),
          children: [
            {
              path: 'details',
              name: 'task-details',
              component: () => import('./views/task-view/task-details/TaskDetails.vue'),
              meta: {
                breadcrumb: ['taskFolder', 'task']
              }
            },
            {
              path: 'comments',
              name: 'task-comments',
              component: () => import('./views/task-view/task-comments/TaskComments.vue'),
              meta: {
                breadcrumb: ['taskFolder', 'task', 'taskComments']
              }
            },
            {
              path: 'attachments',
              name: 'task-attachments',
              component: () => import('./views/task-view/task-attachments/TaskAttachments.vue'),
              meta: {
                breadcrumb: ['taskFolder', 'task', 'taskAttachments']
              }
            },
            {
              path: 'attachment/:attachmentId',
              name: 'task-attachment',
              component: () => import('./views/task-view/task-attachments/TaskAttachments.vue'),
              meta: {
                parent: 'attachments',
                breadcrumb: ['taskFolder', 'task', 'taskAttachments', 'taskAttachment']
              },
              children: [
                {
                  path: 'versions',
                  name: 'versions',
                  component: () => import('./views/task-view/task-attachments/VersionsAndRemarks.vue'),
                  meta: {
                    parent: 'attachments',
                    breadcrumb: ['taskFolder', 'task', 'taskAttachments', 'taskAttachment', 'versions']
                  },
                }
              ]
            }
          ]
        },
        {
          path: '/task-add/:taskId?',
          name: 'task-add',
          props: true,
          component: () => import('./views/task-add/TaskAdd.vue')
        },
        {
          path: '/task/:taskId/edit',
          name: 'task-edit',
          props: true,
          component: () => import('./views/task-add/TaskAdd.vue')
        },
        {
          path: '/work-flow',
          name: 'work-flow',
          component: () => import('./views/work-flow/WorkFlow.vue')
        },
        {
          path: '/cases/:folderId',
          name: 'case-list',
          component: () => import('./views/case-list/CaseList.vue'),
          meta: {
            breadcrumb: ['caseFolder']
          }
        },
        {
          path: '/case/:caseId',
          name: 'case-view',
          redirect: '/case/:caseId/details',
          component: () => import('./views/case-view/CaseView.vue'),
          children: [
            {
              path: 'details',
              name: 'case-details',
              component: () => import('./views/task-view/task-details/TaskDetails.vue'),
              meta: {
                breadcrumb: ['caseFolder', 'case']
              }
            },
            {
              path: 'attachments',
              name: 'case-attachments',
              component: () => import('./views/task-view/task-attachments/TaskAttachments.vue'),
              meta: {
                breadcrumb: ['caseFolder', 'case', 'caseAttachments']
              }
            },
            {
              path: 'comments',
              name: 'case-comments',
              component: () => import('./views/task-view/task-comments/TaskComments.vue'),
              meta: {
                breadcrumb: ['caseFolder', 'case', 'caseComments']
              }
            }
          ]
        },
        {
          path: '/case-add',
          name: 'case-add',
          component: () => import('./views/case-add/CaseAdd.vue')
        },
        {
          path: '/case/:caseId/edit',
          name: 'case-edit',
          component: () => import('./views/case-add/CaseAdd.vue')
        }
      ]
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: '',
      component: () => import('@/layouts/full-page/FullPage.vue'),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/pages/Login.vue'),
          meta: {
            rule: 'editor'
          }
        },
        {
          path: '/pages/error-404',
          name: 'page-error-404',
          component: () => import('@/views/pages/Error404.vue'),
          meta: {
            rule: 'editor'
          }
        },
        {
          path: '/pages/error-500',
          name: 'page-error-500',
          component: () => import('@/views/pages/Error500.vue'),
          meta: {
            rule: 'editor'
          }
        },
        {
          path: '/pages/not-authorized',
          name: 'page-not-authorized',
          component: () => import('@/views/pages/NotAuthorized.vue'),
          meta: {
            rule: 'editor'
          }
        },
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: '*',
      redirect: '/pages/error-404'
    }
  ],
})

router.history.getCurrentLocation = function() {
  let path = window.location.pathname
  let base = router.history.base

  // Removes base from path (case-insensitive)
  if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
    path = path.slice(base.length)
  }
  return (path || '/') + window.location.search + window.location.hash
}

// protection of paths from an unauthenticated access
router.beforeEach(async (to, from, next) => {
  const token = await auth.getToken()
  const unProtectedRoutes = ['/login', '/error-404', '/error-500', '/not-authorized']
  if (token || unProtectedRoutes.includes(to.path)) {
    return next()
  }
  if (router.currentRoute.name !== 'login') {
    await router.push({path: '/login', query: { to: to.path }})
  }
})

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

// Роутер по умолчанию
export default router
