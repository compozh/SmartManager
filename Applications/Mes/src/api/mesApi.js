import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
// Queries
import properties from './graphql/properties.graphql'
import workCenters from './graphql/workCenters.graphql'
import workCentersFixed from './graphql/fixedWorkCenters.graphql'
import tasks from './graphql/tasks/tasks.graphql'
import downtimesPrevious from './graphql/downtimes/downtimesPrevious.graphql'
import installations from './graphql/installations/installations.graphql'
import removeInstallation from './graphql/installations/removeInstallation.graphql'
import registerMaterialInstallation from './graphql/installations/registerMaterialInstallation.graphql'
import registerProduction from './graphql/tasks/registerProduction.graphql'
import cancelBeginRegistration from './graphql/tasks/cancelBeginRegistration.graphql'
import productions from './graphql/productions/productions.graphql'
import deleteProduction from './graphql/productions/deleteProduction.graphql'
import printLabel from './graphql/productions/printLabel.graphql'
import productionFormIo from './graphql/productionFormIo.graphql'
import productionFormIoSubmit from './graphql/productionFormIoSubmit.graphql'
import downtimeFormIo from './graphql/downtimeFormIo.graphql'
import downtimeGetTypes from './graphql/downtimeGetTypes.graphql'
import downtimeFormIoSubmit from './graphql/downtimeFormIoSubmit.graphql'
import ticket from './graphql/ticket.graphql'
import fixWorkCenterForWorker from './graphql/fixWorkCenterForWorker.graphql'
import unfixWorkCenterForWorker from './graphql/unfixWorkCenterForWorker.graphql'
import Vue from 'vue'

const getClient = () => {
  const authHeader =  Vue.prototype.$authentication.getAuthHeader()
  const options = {
    uri: window.myConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      ...authHeader,
      'schema': 'mes'
    }
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  })
}

export class MesApi {
  constructor() {}

  async getPropertiesFromGql () {
    const result = await getClient().query({
      query: gql` ${properties}`
    })
      .then(result => result)
    return result
  }


  async getTicketFromGql () {
    const result = await getClient().query({
      query: gql` ${ticket}`
    })
      .then(result => result)
    return result
  }

  async fixWorkCenterForWorkerGql(workCenterCode, workerCode) {
    const result = await getClient().mutate({
      mutation: gql`${fixWorkCenterForWorker}`,
      variables: { workCenterCode, workerCode }
    })
      .then(result => result)
    return result.data.mesMutation.fixWorkCenterForWorker
  }

  async unfixWorkCenterForWorkerGql(fixationIds) {
    var fixationId = fixationIds.fixationId
    const result = await getClient().mutate({
      mutation: gql`${unfixWorkCenterForWorker}`,
      variables: { fixationId }
    })
      .then(result => result)
    return result.data.mesMutation.unfixWorkCenterForWorker
  }

  async getWorkCentersFromGql(uuid, login, fetchPolicy) {
    const result = await getClient().query({
      query: gql` query ($uuid: String, $login: String) ${workCenters}`,
      variables: { uuid, login },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
      .then(result => result)
    return result.data.mes.workCenters
  }

  async getWorkCentersFixedFromGql(workerCode, fetchPolicy) {
    const result = await getClient().query({
      query: gql` query ($workerCode: String) ${workCentersFixed}`,
      variables: { workerCode },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
      .then(result => result)
    return result.data.mes.workCentersFixed
  }

  async getTasksFromGql(workCenter, fetchPolicy) {
    const result = await getClient().query({
      query: gql`query ($workCenter: String) ${tasks}`,
      variables: { workCenter },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
      .then(result => result)
    return result.data.mes.tasks
  }

  async getDowntimesPreviousFromGql(workCenterCode, dateTime) {
    const result = await getClient().query({
      query: gql`query ($workCenterCode: String, $dateTime: DateTime) ${downtimesPrevious}`,
      variables: { workCenterCode, dateTime }
    })
      .then(result => result)
    return result.data.mes.downtimePrevious.downtimeList
  }

  async getInstallationsFromGql(workCenter, fetchPolicy) {
    const result = await getClient().query({
      query: gql`query ($workCenter: String) ${installations}`,
      variables: { workCenter },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
      .then(result => result)
    return result.data.mes.installations.installations
  }

  async removeInstallationGql(installationId) {
    const result = await getClient().mutate({
      mutation: gql`${removeInstallation}`,
      variables: { installationId }
    })
      .then(result => result)
    return result.data.mesMutation.removeInstallation
  }

  async registerMaterialInstallationGql(workCenterCode, batchBarcode, factId) {
    const result = await getClient().mutate({
      mutation: gql`${registerMaterialInstallation}`,
      variables: { workCenterCode, batchBarcode, factId }
    })
      .then(result => result)
    return result.data.mesMutation.registerMaterialInstallation
  }

  async registerProductionGql(productionRegistrationParam) {
    const result = await getClient().mutate({
      mutation: gql`${registerProduction}`,
      variables: { productionRegistrationParam }
    })
      .then(result => result)
    return result.data.mesMutation.registerProduction
  }
  async cancelBeginRegistrationGql(taskId) {
    const result = await getClient().mutate({
      mutation: gql`${cancelBeginRegistration}`,
      variables: { taskId }
    })
      .then(result => result)
    return result.data.mesMutation.cancelBeginRegistration
  }
  async getProductionsFromGql(workerCode, fetchPolicy) {
    const result = await getClient().query({
      query: gql`query ($workerCode: String) ${productions}`,
      variables: { workerCode },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
      .then(result => result)
    return result.data.mes.usersProductionEvents
  }
  async deleteProductionGql(factId) {
    const  result = await getClient().mutate({
      mutation: gql`${deleteProduction}`,
      variables: { factId }
    })
      .then(result => result)
    return result.data.mesMutation.deleteProduction
  }
  async printProductionGql(factId, checkWriteOffPercent) {
    const  result = await getClient().mutate({
      mutation: gql`query ($factId: Int, $checkWriteOffPercent: Boolean!) ${printLabel}`,
      variables: { factId, checkWriteOffPercent }
    })
      .then(result => result)
    return result.data.mes.printLabel
  }
  async getProductionFormioFromGql(formCode, properties) {
    const result = await getClient().query({
      query: gql`query ($formCode: String, $properties: ProductionRegistrationParamsInput!) ${productionFormIo}`,
      variables: { formCode, properties },
      fetchPolicy: 'network-only'
    })
      .then(result => result)
    return result.data.mes.productionFormIo
  }
  async productionFormIoSubmitGql({ formCode, data, productionRegistrationParam}) {
    const result = await getClient().mutate({
      mutation: gql`${productionFormIoSubmit}`,
      variables: { formCode, data, productionRegistrationParam}
    })
      .then(result => result)
    return result.data.mesMutation.productionFormIoSubmit
  }
  async getDowntimeFormioFromGql(formCode, properties, fetchPolicy) {
    const result = await getClient().query({
      query: gql`query ($formCode: String, $properties: DowntimeParamsInput!) ${downtimeFormIo}`,
      variables: { formCode, properties },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
      .then(result => result)
    return result.data.mes.downtimeFormIo
  }
  async getDowntimeTypesFromGql() {
    const result = await getClient().query({
      query: gql` ${downtimeGetTypes}`
    })
      .then(result => result)
    return result.data.mes.downtimeTypes
  }
  async downtimeFormIoSubmitGql({ formCode, data, downtimeParams}) {
    const result = await getClient().mutate({
      mutation: gql`${downtimeFormIoSubmit}`,
      variables: { formCode, data, downtimeParams}
    })
      .then(result => result)
    return result.data.mesMutation.downtimeFormIoSubmit
  }
  generateUUID() { // Public Domain/MIT
    var d = new Date().getTime()
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now() //use high-precision timer if available
    }
    var newGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    return newGuid
  }
}
