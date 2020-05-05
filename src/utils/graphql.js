import Vue from 'vue'
import GraphQlCore from '@it-enterprise/graphql'
import apollo from '@/utils/apollo'
import axios from 'axios'

Vue.use(GraphQlCore, {
  options: window.appConfig,
  dependencies: {
    apolloProvider: apollo,
    axios
  }
})
