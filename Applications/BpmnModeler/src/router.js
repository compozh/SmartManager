
import Vue from 'vue';
import VueRouter from 'vue-router';
import auth from '@it-enterprise/jwtauthentication';
const config = window.config;

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: config.BaseUrl + 'bpmnmodeler/',
  routes: [
    {
      path: '/',
      component: () => import('./components/BpmnLayout.vue'),
      children: [
        {
          name: 'login',
          path: '/login',
          caseSensitive: false,
          meta: {
            rule: 'isPublic',
          },
          component: () => import('@/components/pages/Login.vue'),
        },
        {
          path: '/',
          name: 'main',
          component: () => import('@/components/pages/Main.vue'),
          meta: {
            rule: 'isPublic',
          },
        },
        {
          name: 'project',
          path: '/project/:id?',
          component: () => import('@/components/pages/Project.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
          props: {
            item: Object
          },
        }, 
        {
          name: 'decision',
          path: '/decision/:id?',
          component: () => import('@/components/modelers/DmnModeler.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
        },
        {
          name: 'process',
          path: '/process/:id?',
          component: () => import('@/components/modelers/BpmnModeler.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
        },
        {
          path: 'error/:status_code/',
          name: 'ERROR',
          component: () => import('@/components/pages/Error.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false
        },
      ]
    },
    {
      path: '/*',
      redirect: 'error/404/',
      caseSensitive: false,
      allowAnonymous: true,
      meta: {
        rule: 'isPublic',
      },
    }
  ]
});


router.beforeEach(async (to, from, next) => {
  const token = await auth.getToken();
  if (
    to.path === '/login' || to.path === 'login' ||
    to.path === '/error/404' ||
    to.path === '/error/500' ||
    token
  ) {
    let same = Object.values(to).every((el) => {
      return Object.values(from).find(fromEl =>  fromEl == el); 
    });
    if ( same ) {
      return; 
    } else  {
      return next();
    }
  } 
  router.push({ name: 'login', query: { to: from.path } });
});

// Исправление для поддержки регистронезависимого base path
// https://github.com/vuejs/vue-router/issues/2154
if (router.mode === 'history') {
  router.history.getCurrentLocation = function () {
    let path = window.location.pathname;
    let base = router.history.base;

    // Removes base from path (case-insensitive)
    if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
      path = path.slice(base.length);
    }

    return (path || '/') + window.location.search + window.location.hash;
  };
}

export default router;
