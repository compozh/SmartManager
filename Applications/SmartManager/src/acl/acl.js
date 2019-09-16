import Vue from 'vue'
import { AclInstaller, AclCreate, AclRule } from 'vue-acl'
import router from '@/router'
Vue.use(AclInstaller)

let initialRole = 'admin'


export default new AclCreate({
  initial: initialRole,
  notfound: '/login',
  router: router,
  acceptLocalRules: true,
  globalRules: {
    admin: new AclRule('admin').generate(),

    editor: new AclRule('editor').or('admin').generate(),

    //authorized: new AclRule('authorized').generate(),
  }
})
