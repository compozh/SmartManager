import Vue from 'vue'
import { AclInstaller, AclCreate, AclRule } from 'vue-acl'

Vue.use(AclInstaller)

let initialRole = 'admin'

export function getAcl(router) {
  return new AclCreate({
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
}
