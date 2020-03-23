export default [
  {
    // =============================================================================
    // MAIN LAYOUT ROUTES
    // =============================================================================
    path: '/',
    component: () => import('@/layouts/Main.vue'),
    children: [
      {
        path: '',
        redirect: 'tasks/active'
      },
      {
        path: 'tasks/:folderId',
        name: 'task-list',
        component: () => import('@/views/tasks/task-list/TaskList.vue')
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
        path: 'login',
        component: () => import('@/pages/Login.vue')
      }
    ]
  }
]
