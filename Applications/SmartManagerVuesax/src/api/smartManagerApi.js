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
import auth from './auth/auth'

const getClient = () => {
  const authHeader = auth.getAuthHeader()
  const options = {
    // eslint-disable-next-line no-undef
    uri: appConfig.GrapgQlUrl + 'api/graphql',
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

  static async getFoldersFromGql() {
    try {
      let result = await getClient()
        .query({
          query: gql `${folders}`
        })
      return await result
    } catch (e) {
      return console.log(e.message)
    }
  }

  static async getTasksFromGql(folderId) {
    try {
      let result = await getClient()
        .query({
          query: gql `${tasks}`,
          variables: {folderId}
        })
      return await result
    } catch (e) {
      return console.log(e.message)
    }
  }

  static async getTaskInfoFromGql(taskId) {
    try {
      let result = await getClient()
        .query({
          query: gql`${taskInfo}`,
          variables: {taskId}
        })
      return await result
    } catch (e) {
      return console.log(e.message)
    }
  }

  static async getUsersFromGql() {
    try {
      let result = await getClient()
        .query({
          query: gql `${users}`,
        })
      return await result
    } catch (e) {
      return console.log(e.message)
    }
  }

  static async addNewTaskToGql(newTask) {
    try {
      let result = await getClient()
        .mutate({
          mutation: gql `${addTask}`,
          variables: {newTask}
        })
      return await result
    } catch (e) {
      return console.log(e.message)
    }
  }

  static async changeTaskStatusInGql(status) {
    try {
      let result = await getClient()
        .mutate({
          mutation: gql `${changeStatus}`,
          variables: {status}
        })
      return await result
    } catch (e) {
      return console.log(e.message)
    }
  }

  static async addAttachmentsInGql(taskId, attachments) {
    try {
      let result = await getClient()
        .mutate({
          mutation: gql `${addAttachments}`,
          variables: {taskId, attachments}
        })
      return await result
    } catch (e) {
      return console.log(e.message)
    }
  }

  static async changeTaskStageInGql(stageParams) {
    try {
      let result = await getClient()
        .mutate({
          mutation: gql `${changeStage}`,
          variables: {stageParams}
        })
      return await result
    } catch (e) {
      return console.log(e.message)
    }
  }

  static async addTaskCommentToGql(comment, params) {
    try {
      let result = await getClient()
        .mutate({
          mutation: gql `${addComment}`,
          variables: {comment, params}
        })
      console.log('comment: ', result)
      return await result
    } catch (e) {
      return console.log(e.message)
    }
  }
}
