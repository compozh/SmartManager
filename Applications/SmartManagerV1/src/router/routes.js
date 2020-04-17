export default [
  {
    // =============================================================================
    // MAIN LAYOUT ROUTES
    // =============================================================================
    path: '',
    component: () => import('@/layouts/main/Main.vue'),
    children: [
      {
        path: '/',
        redirect: '/tasks/active'
      },
      {
        path: '/tasks/:folderId',
        name: 'task-list',
        component: () => import('@/views/tasks/task-list/TaskList.vue'),
        meta: {
          breadcrumb: ['taskFolder']
        }
      },
      {
        path: '/task/:taskId',
        name: 'task-view',
        redirect: '/task/:taskId/details',
        component: () => import('@/views/tasks/TaskView.vue'),
        children: [
          {
            path: 'details',
            name: 'task-details',
            component: () => import('@/views/tasks/TaskDetails.vue'),
            meta: {
              breadcrumb: ['taskFolder', 'task']
            }
          },
          {
            path: 'comments',
            name: 'task-comments',
            component: () => import('@/views/comments/Comments.vue'),
            meta: {
              breadcrumb: ['taskFolder', 'task', 'taskComments']
            }
          },
          {
            path: 'attachments',
            name: 'task-attachments',
            component: () => import('@/views/attachments/Attachments.vue'),
            meta: {
              breadcrumb: ['taskFolder', 'task', 'taskAttachments']
            }
          },
          {
            path: 'attachment/:attachmentId',
            name: 'task-attachment',
            component: () => import('@/views/attachments/Attachments.vue'),
            meta: {
              parent: 'attachments',
              breadcrumb: ['taskFolder', 'task', 'taskAttachments', 'taskAttachment']
            },
            children: [
              {
                path: 'versions',
                name: 'versions',
                component: () => import('@/views/attachments/VersionsAndRemarks.vue'),
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
        component: () => import('@/views/tasks/task-add/TaskAdd.vue')
      },
      {
        path: '/task/:taskId/edit',
        name: 'task-edit',
        props: true,
        component: () => import('@/views/tasks/task-add/TaskAdd.vue')
      },
      {
        path: '/work-flow',
        name: 'work-flow',
        component: () => import('@/views/work-flow/WorkFlow.vue')
      },
      {
        path: '/cases/:folderId',
        name: 'case-list',
        component: () => import('@/views/cases/case-list/CaseList.vue'),
        meta: {
          breadcrumb: ['caseFolder']
        }
      },
      {
        path: '/case/:caseId',
        name: 'case-view',
        redirect: '/case/:caseId/details',
        component: () => import('@/views/cases/CaseView.vue'),
        children: [
          {
            path: 'details',
            name: 'case-details',
            component: () => import('@/views/tasks/TaskDetails.vue'),
            meta: {
              breadcrumb: ['caseFolder', 'case']
            }
          },
          {
            path: 'attachments',
            name: 'case-attachments',
            component: () => import('@/views/attachments/Attachments.vue'),
            meta: {
              breadcrumb: ['caseFolder', 'case', 'caseAttachments']
            }
          },
          {
            path: 'comments',
            name: 'case-comments',
            component: () => import('@/views/comments/Comments.vue'),
            meta: {
              breadcrumb: ['caseFolder', 'case', 'caseComments']
            }
          }
        ]
      },
      {
        path: '/case-add',
        name: 'case-add',
        component: () => import('@/views/cases/case-add/CaseAdd.vue')
      },
      {
        path: '/case/:caseId/edit',
        name: 'case-edit',
        component: () => import('@/views/cases/case-add/CaseAdd.vue')
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
        component: () => import('@/pages/Login.vue')
      },
      {
        path: '/pages/error-404',
        name: 'page-error-404',
        component: () => import('@/pages/Error404.vue')
      },
      {
        path: '/pages/error-500',
        name: 'page-error-500',
        component: () => import('@/pages/Error500.vue')
      }
    ]
  },
  // Redirect to 404 page, if no match found
  {
    path: '*',
    redirect: '/pages/error-404'
  }
]
