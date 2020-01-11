import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import {onError} from 'apollo-link-error'
import gql from 'graphql-tag'
import auth from '@it-enterprise/jwtauthentication'
import router from '@/router'
// Queries
import folders from './graphql/folders.graphql'
import tasks from './graphql/tasks.graphql'
import cases from './graphql/cases.graphql'
import caseDetails from './graphql/caseDetails.graphql'
import caseCreate from './graphql/caseCreate.graphql'
import caseUpdate from './graphql/caseUpdate.graphql'
import caseFolderCreate from './graphql/caseFolderCreate.graphql'
import binding from './graphql/binding.graphql'
import taskInfo from './graphql/taskInfo.graphql'
import fileUrl from './graphql/fileUrl.graphql'
import users from './graphql/users.graphql'
import addTask from './graphql/addTask.graphql'
import updateTask from './graphql/updateTask.graphql'
import taskPin from './graphql/taskPin.graphql'
import taskDelete from './graphql/taskDelete.graphql'
import changeStatus from './graphql/changeStatus.graphql'
import addAttachments from './graphql/addAttachments.graphql'
import attachmentDelete from './graphql/attachmentDelete.graphql'
import changeStage from './graphql/changeStage.graphql'
import addComment from './graphql/addComment.graphql'
import businessProcesses from './graphql/businessProcesses.graphql'
import formDefinition from './graphql/formDefinition.graphql'
import startBusinessProcess from './graphql/startBusinessProcess.graphql'

const errorLink = onError(({graphQLErrors, networkError}) => {
  if (networkError && networkError.statusCode === 401) {
    auth.clearTokens()
    router.push('/login')
  }
  if (graphQLErrors) {
    // TODO: Обработать ошибку
    return graphQLErrors.message
  }
})

const getClient = async schema => {
  const token = await auth.getToken()
  const options = {
    // eslint-disable-next-line no-undef
    uri: appConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${token}`,
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
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${folders}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getTasksFromGql(folderId) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${tasks}`,
        variables: {folderId}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getTaskInfoFromGql(taskId) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${taskInfo}`,
        variables: {taskId}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getFileUrlFromGql(id, ext) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${fileUrl}`,
        variables: {id, ext}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getUsersFromGql() {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${users}`,
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async addNewTaskToGql(newTask) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${addTask}`,
        variables: {newTask}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async updateTaskInGql(taskData) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${updateTask}`,
        variables: {taskData}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async changeTaskStatusInGql(statusParams) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${changeStatus}`,
        variables: {statusParams}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async addAttachmentsInGql(attachments, params) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${addAttachments}`,
        variables: {attachments, params}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async changeTaskStageInGql(stageParams) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${changeStage}`,
        variables: {stageParams}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async addCommentToGql(comment, params) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${addComment}`,
        variables: {comment, params}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getBusinessProcessesFromGql() {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${businessProcesses}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getFormDefinitionFromGql(procDefId) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${formDefinition}`,
        variables: {procDefId}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async startBusinessProcessInGql(processData) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${startBusinessProcess}`,
        variables: {processData}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getCasesFromGql() {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${cases}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getCaseDetailsFromGql(caseId) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${caseDetails}`,
        variables: {caseId}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async caseCreateInGql(newCase) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${caseCreate}`,
        variables: {newCase}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async updateCaseInGql(caseData) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${caseUpdate}`,
        variables: {caseData}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async caseFolderCreateInGql(folderName) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${caseFolderCreate}`,
        variables: {folderName}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async changeBindingInGql(caseId, taskId, bind) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${binding}`,
        variables: {caseId, taskId, bind}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async taskDeleteInGql(taskId) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${taskDelete}`,
        variables: {taskId}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async taskPinInGql(taskId, pin) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${taskPin}`,
        variables: {taskId, pin}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async attachmentDeleteInGql(id) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${attachmentDelete}`,
        variables: {id}
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }
}
