import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import gql from 'graphql-tag'
import auth from '@/utils/auth'
import router from '@/router'

// QUERIES
const q = {}
const queries = require.context('./graphql/', true, /\.graphql$/)
queries.keys().forEach(key => {
  q[key.replace(/\.(\/|graphql)/g, '')] = queries(key)
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
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
    uri: appConfig.GqlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
      schema: schema
    }
  }
  const httpLink = new HttpLink(options)
  return new ApolloClient({
    cache: new InMemoryCache({
      dataIdFromObject: o => {
        return o.procDefId && o.__typename && o.__typename === 'BusinessProcess' ? `${o.__typename}:${o.procDefId}` : `${o.__typename}:${o.id}`
      }
    }),
    link: errorLink.concat(httpLink)
  })
}

export class SmartManagerApi {
  static async getApplicationParamsFromGql () {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.applicationParams}`
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getFoldersFromGql () {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.folders}`
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getTasksFromGql ({ folderId, helperExec }) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.tasks}`,
        variables: { folderId, helperExec }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getTaskDetailsFromGql (taskId) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.taskDetails}`,
        variables: { taskId }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getFileDetailsFromGql (id, ext, size) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.fileDetails}`,
        variables: { id, ext, size }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getUsersFromGql () {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.users}`
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async addNewTaskToGql (newTask) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.addTask}`,
        variables: { newTask }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async updateTaskInGql (taskData) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.updateTask}`,
        variables: { taskData }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async changeTaskStatusInGql (statusParams) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.changeStatus}`,
        variables: { statusParams }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async addAttachmentsInGql (attachments, params) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.addAttachments}`,
        variables: { attachments, params }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async attachmentDeleteInGql (id) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.attachmentDelete}`,
        variables: { id }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async addAttachmentVersionInGql (fileId, filePath) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.addAttachmentVersion}`,
        variables: { id: fileId, name: filePath }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async setActiveVersionInGql (id) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.setActiveVersion}`,
        variables: { id }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getPdfUrlFromGql (id) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.getPdfUrl}`,
        variables: { id }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async deleteVersionInGql (id) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.deleteVersion}`,
        variables: { id }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async addNoteInGql (versionId, noteText) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.noteAdd}`,
        variables: { versionId, noteText }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async updateNoteInGql (noteId, noteText) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.noteUpdate}`,
        variables: { noteId, noteText }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async deleteNoteFromGql (noteId) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.noteDelete}`,
        variables: { noteId }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async changeTaskStageInGql (stageParams) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.changeStage}`,
        variables: { stageParams }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getCommentsFromGql (type, id) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.commentsGet}`,
        variables: { type, id }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async addCommentToGql (comment, params) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.commentAdd}`,
        variables: { comment, params }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getBusinessProcessesFromGql () {
    try {
      const client = await getClient('workFlow')
      return await client.query({
        query: gql`${q.businessProcesses}`
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getFormDefinitionFromGql (procDefId) {
    try {
      const client = await getClient('workFlow')
      return await client.query({
        query: gql`${q.formDefinition}`,
        variables: { procDefId }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async startProcessInGql (processData) {
    try {
      const client = await getClient('workFlow')
      return await client.query({
        query: gql`${q.startBusinessProcess}`,
        variables: { processData }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getExternalTaskInfo (externalId) {
    try {
      const client = await getClient('workFlow')
      return await client.query({
        query: gql`${q.externalTaskInfo}`,
        variables: { externalId }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getCasesFromGql () {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.cases}`
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getCaseDetailsFromGql (caseId) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.caseDetails}`,
        variables: { caseId }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async caseCreateInGql (newCase) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.caseCreate}`,
        variables: { newCase }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async updateCaseInGql (caseData) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.caseUpdate}`,
        variables: { caseData }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async caseFolderCreateInGql (folderName) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.caseFolderCreate}`,
        variables: { folderName }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async changeBindingInGql (caseId, taskId, bind) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.binding}`,
        variables: { caseId, taskId, bind }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async taskDeleteInGql (taskId) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.taskDelete}`,
        variables: { taskId }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async taskPinInGql (taskId, pin) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.taskPin}`,
        variables: { taskId, pin }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async globalSearchInGql (searchText) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.globalSearch}`,
        variables: { searchText }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getAttachmentTypesFromGql (params) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.attachmentTypes}`,
        variables: { params }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async checkSignInGql (id) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.signCheck}`,
        variables: { id }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async beforeSignInGql (id, params) {
    try {
      const client = await getClient('smartmanager')
      return await client.query({
        query: gql`${q.signBefore}`,
        variables: { id, params }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async signAttachmentInGql (id, params) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.signAttachment}`,
        variables: { id, params }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async deleteSignFromGql (id) {
    try {
      const client = await getClient('smartmanager')
      return await client.mutate({
        mutation: gql`${q.signDelete}`,
        variables: { id }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async getEscalationFormFromGql (params) {
    try {
      const client = await getClient('workFlow')
      return await client.query({
        query: gql`${q.escalationForm}`,
        variables: { params }
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  static async createEscalationInGql (params) {
    try {
      const client = await getClient('workFlow')
      return await client.query({
        query: gql`${q.escalationCreate}`,
        variables: { params }
      })
    } catch (e) {
      console.error(e.message)
    }
  }
}
