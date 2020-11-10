export default [
  {
    // =============================================================================
    // MAIN LAYOUT ROUTES
    // =============================================================================
    path: '',
    component: () => import('@/layouts/Main.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        redirect: '/tasks/active'
      },
      {
        path: '/tasks',
        redirect: '/tasks/active'
      },
      {
        path: '/tasks/:folderId',
        name: 'task-list',
        component: () => import('@/views/tasks/task-list/TaskList.vue'),
        meta: {
          zone: 'tasks'
        },
        children: [
          {
            path: ':taskId',
            name: 'task-details',
            component: () => import('@/views/tasks/task-details/TaskDetails.vue'),
            meta: {
              zone: 'tasks'
            }
          }
        ]
      },
      {
        path: '/task/:taskId',
        name: 'task',
        redirect: '/tasks/active/:taskId'
      },
      {
        path: '/cases',
        redirect: '/cases/all'
      },
      {
        path: '/cases/:folderId',
        name: 'case-list',
        component: () => import('@/views/cases/case-list/CaseList.vue'),
        meta: {
          zone: 'cases'
        },
        children: [
          {
            path: ':caseId',
            name: 'case-details',
            component: () => import('@/views/cases/case-details/CaseDetails.vue'),
            meta: {
              zone: 'cases'
            }
          }
        ]
      },
      {
        path: '/processes',
        name: 'processes',
        component: () => import('@/views/processes/Processes.vue'),
        meta: {
          zone: 'processes'
        },
        children: [
          {
            path: ':processId',
            name: 'process',
            component: () => import('@/views/processes/Process.vue'),
            meta: {
              zone: 'processes'
            }
          }
        ]
      }
    ]
  },
  {
    // =============================================================================
    // FULL PAGE LAYOUT ROUTES
    // =============================================================================
    path: '',
    component: () => import('@/layouts/FullPage.vue'),
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/Login.vue')
      },
      {
        path: '/error-404',
        name: 'page-error-404',
        component: () => import('@/pages/Error404.vue')
      },
      {
        path: '/error-500',
        name: 'page-error-500',
        component: () => import('@/pages/Error500.vue')
      },
      {
        path: '/network-error',
        name: 'page-network-error',
        component: () => import('@/pages/NetworkError.vue')
      }
    ]
  },
  // Redirect to 404 page, if no match found
  {
    path: '*',
    redirect: '/error-404'
  }
]
