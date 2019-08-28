import Vue from 'vue'
import { AclInstaller, AclCreate, AclRule } from 'vue-acl'
import router from '@/router'
Vue.use(AclInstaller)

let initialRole = 'anonimous'

export default new AclCreate({
  initial: initialRole,
  notfound: '/login',
  router: router,
  acceptLocalRules: true,
  globalRules: {
    public: new AclRule('anonimous').generate(),
    //authorized: new AclRule('authorized').generate(),
  }
})
