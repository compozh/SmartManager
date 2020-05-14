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
        redirect: 'tasks/active'
      },
      {
        path: '/tasks/:folderId',
        name: 'task-list',
        component: () => import('@/views/tasks/task-list/TaskList.vue')
      },
      {
        path: '/task/create',
        name: 'task-create',
        component: () => import('@/views/tasks/task-create/TaskForm.vue')
      },
      {
        path: '/task/:taskId',
        name: 'task-details',
        component: () => import('@/views/tasks/task-details/TaskDetails.vue')
      },
      {
        path: '/processes',
        name: 'processes',
        component: () => import('@/views/processes/Processes.vue')
      },
      {
        path: '/process',
        name: 'process',
        component: () => import('@/views/processes/Process.vue')
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
      }
    ]
  }
]
