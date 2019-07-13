import {ApolloClient} from 'apollo-client'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

const promise = () => import('./graphQlCore')

const _namespace = 'GraphQlCore'

//Cache implementation
const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
  link: new HttpLink({}),
  cache,
  connectToDevTools: true,
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

export default {

  /**
   *
   * @param {*} Vue
   * @param {*} params.dependencies.modulesManager
   */
  install(Vue, params) {
    let { options, dependencies } = params || {}

    if (!dependencies) {
      throw new Error('Зависимости должны быть переданы')
    }

    Vue.use(VueApollo)
    Vue.prototype.$apolloProvider = apolloProvider
    dependencies.modulesManager.register(_namespace, ()=> promise().then(module => new module.default(options, dependencies)))


  }
}