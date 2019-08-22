import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import gql from 'graphql-tag'
// Queries
import folders from './graphql/folders.graphql'
import tasks from './graphql/tasks.graphql'
import taskInfo from './graphql/taskInfo.graphql'
import users from './graphql/users.graphql'
import addTask from './graphql/addTask.graphql'
import changeStatus from './graphql/changeStatus.graphql'
import addAttachments from './graphql/addAttachments.graphql'
import changeStage from './graphql/changeStage.graphql'
import addComment from './graphql/addComment.graphql'
import Vue from 'vue'

const getClient = () => {
  const authHeader =  Vue.prototype.$authentication.getAuthHeader()
  const options = {
    // eslint-disable-next-line no-undef
    uri: myConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      ...authHeader,
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
      mutation: gql`mutation ($newTask: String) ${addTask}`,
      variables: {
        newTask: JSON.stringify(newTask)
      }
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }

  changeTaskStatusInGql(status) {
    return getClient().mutate({
      mutation: gql`mutation ($status: String) ${changeStatus}`,
      variables: {
        status: JSON.stringify(status)
      }
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }

  addAttachmentsInGql(taskId, attachments) {
    return getClient().mutate({
      mutation: gql`mutation ($taskId: Int, $attachments: String) ${addAttachments}`,
      variables: {
        taskId,
        attachments: JSON.stringify(attachments)
      }
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }

  changeTaskStageInGql(stageParams) {
    return getClient().mutate({
      mutation: gql`mutation ($stageParams: String) ${changeStage}`,
      variables: {
        stageParams: JSON.stringify(stageParams)
      }
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }

  addTaskCommentToGql(comment, params) {
    return getClient().mutate({
      mutation: gql`mutation ($comment: String, $params: String) ${addComment}`,
      variables: {
        comment,
        params: JSON.stringify(params)
      }
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }
}
