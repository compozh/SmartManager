import Vue from 'vue'
import { AclInstaller, AclCreate, AclRule } from 'vue-acl'
import router from '../router'
import store from '../store/index'

 
Vue.use(AclInstaller)
export default new AclCreate({
  initial: store.state.auth.user ? 'user' : 'public' ,
  notfound: {
    path: '/error/403',
    forwardQueryParams: true,
  },
  router,
  acceptLocalRules: true,
  globalRules: {
    isAdmin: new AclRule('admin').or('ALL_PAGES').generate(),
    isPublic: new AclRule('public').or('admin').or('ALL_PAGES').or('ONLY_INSTALLATION').or('ONLY_QUALITY').or(('PRODUCTION')).or('user').generate(),
    isUser: new AclRule('user').generate(),
    onlyQuality : new AclRule('ONLY_QUALITY').or('ALL_PAGES').or('admin').or('user').generate(),
    Production : new AclRule('PRODUCTION').or('ALL_PAGES').or('admin').or('user').generate(),
    onlyInstallations : new AclRule('ONLY_INSTALLATION').or('PRODUCTION').or('ALL_PAGES').or('admin').or('user').generate(),
    allPages:  new AclRule('ALL_PAGES').or('admin').or('user').generate()
  },
  middleware: async acl => {
    let role = store.state.auth.user ? 'user' : 'public'
    let center = store.getters['mes/workCenter']
    if(center){
      // let access = center.accessPages
      // acl.change(access)
    } else {
      acl.change(role) 
    }
  }
})