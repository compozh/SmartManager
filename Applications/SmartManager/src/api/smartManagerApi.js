import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import {onError} from 'apollo-link-error'
import gql from 'graphql-tag'
// Queries
import folders from './graphql/folders.graphql'
import tasks from './graphql/tasks.graphql'
import cases from './graphql/cases.graphql'
import taskInfo from './graphql/taskInfo.graphql'
import fileUrl from './graphql/fileUrl.graphql'
import users from './graphql/users.graphql'
import addTask from './graphql/addTask.graphql'
import changeStatus from './graphql/changeStatus.graphql'
import addAttachments from './graphql/addAttachments.graphql'
import changeStage from './graphql/changeStage.graphql'
import addComment from './graphql/addComment.graphql'
import businessProcesses from './graphql/businessProcesses.graphql'
import formDefinition from './graphql/formDefinition.graphql'
import startBusinessProcess from './graphql/startBusinessProcess.graphql'
import auth from './auth/auth'
import router from '@/router'

const errorLink = onError(({graphQLErrors, networkError}) => {
  if (graphQLErrors) {
    return graphQLErrors.message // TODO: Обработать ошибку
  }
  if (networkError.statusCode === 401) {
    auth.logOff()
    router.push('/login')
  }
})

const getClient = schema => {
  const authHeader = auth.getAuthHeader()
  const options = {
    // eslint-disable-next-line no-undef
    uri: appConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      ...authHeader,
      'schema': schema
    }
  }
  const httpLink = new HttpLink(options)
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(httpLink)
  })
}

export class SmartManagerApi {

  static async getFoldersFromGql() {
    try {
      return await getClient('smartmanager')
        .query({
          query: gql`${folders}`
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getTasksFromGql(folderId) {
    try {
      return await getClient('smartmanager')
        .query({
          query: gql`${tasks}`,
          variables: {folderId}
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getTaskInfoFromGql(taskId) {
    try {
      return await getClient('smartmanager')
        .query({
          query: gql`${taskInfo}`,
          variables: {taskId}
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getFileUrlFromGql(id, ext) {
    try {
      return await getClient('smartmanager')
        .query({
          query: gql`${fileUrl}`,
          variables: {id, ext}
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getUsersFromGql() {
    try {
      return await getClient('smartmanager')
        .query({
          query: gql`${users}`,
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async addNewTaskToGql(newTask) {
    try {
      return await getClient('smartmanager')
        .mutate({
          mutation: gql`${addTask}`,
          variables: {newTask}
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async changeTaskStatusInGql(status) {
    try {
      return await getClient('smartmanager')
        .mutate({
          mutation: gql`${changeStatus}`,
          variables: {status}
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async addAttachmentsInGql(taskId, attachments) {
    try {
      return await getClient('smartmanager')
        .mutate({
          mutation: gql`${addAttachments}`,
          variables: {taskId, attachments}
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async changeTaskStageInGql(stageParams) {
    try {
      return await getClient('smartmanager')
        .mutate({
          mutation: gql`${changeStage}`,
          variables: {stageParams}
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async addTaskCommentToGql(comment, params) {
    try {
      return await getClient('smartmanager')
        .mutate({
          mutation: gql`${addComment}`,
          variables: {comment, params}
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getBusinessProcessesFromGql() {
    try {
      return await getClient('WORKFLOW')
        .query({
          query: gql`${businessProcesses}`
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getFormDefinitionFromGql(procDefId) {
    try {
      return await getClient('WORKFLOW')
        .query({
          query: gql`${formDefinition}`,
          variables: {procDefId}
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async startBusinessProcessInGql(processData) {
    try {
      return await getClient('WORKFLOW')
        .query({
          query: gql`${startBusinessProcess}`,
          variables: {processData}
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getCasesFromGql() {
    try {
      return await getClient('smartmanager')
      .query({
        query: gql`${cases}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }
}
