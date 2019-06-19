import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag'
// Queries
import folders from './graphql/folders.graphql'
import tasks from './graphql/tasks.graphql'
import taskInfo from './graphql/taskInfo.graphql'

const options = {
  uri: myConfig.GrapgQlUrl + 'api/graphql',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken'),
    'schema': 'smartmanager'
  }
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink(options)
})

export class SmartManagerApi {
  constructor() {}

  getFoldersFromGql() {
    return client.query({
      query: gql` ${folders}`
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  getTasksFromGql(folderId) {
    return client.query({
      query: gql`query ($folderId: String) ${tasks}`,
      variables: { folderId }
    })
    .then(result =>  result)
    .catch(error => console.log(error.message))
  }

  getTaskInfoFromGql(taskId) {
    return client.query({
      query: gql`query ($taskId: Int) ${taskInfo}`,
      variables: { taskId }
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }
}