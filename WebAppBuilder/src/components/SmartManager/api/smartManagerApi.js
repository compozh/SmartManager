import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import gql from 'graphql-tag'
// Queries
import folders from './graphql/folders.graphql'
import tasks from './graphql/tasks.graphql'
import taskInfo from './graphql/taskInfo.graphql'
import users from './graphql/users.graphql'
import addTask from './graphql/addTask.graphql'

const getClient = () => {
  const token = localStorage.getItem('ItUniTocken')
  const options = {
    uri: myConfig.GrapgQlUrl + 'api/graphql',
    headers: {
      'Authorization': 'Bearer ' + token,
      'schema': 'smartmanager'
    }
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  })
}

export class SmartManagerApi {
  constructor() {}

  getFoldersFromGql() {
    return getClient().query({
      query: gql` ${folders}`
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  getTasksFromGql(folderId) {
    return getClient().query({
      query: gql`query ($folderId: String) ${tasks}`,
      variables: {folderId}
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  getTaskInfoFromGql(taskId) {
    return getClient().query({
      query: gql`query ($taskId: Int) ${taskInfo}`,
      variables: {taskId}
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  getUsersFromGql() {
    return getClient().query({
      query: gql` ${users}`,
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  addNewTaskToGql(newTask) {
    return getClient().mutate({
      mutation: gql`mutation ($newTask: AddTask!) ${addTask}`,
      variables: {newTask}
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }
}