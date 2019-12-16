import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

import Vue from 'vue'
// Queries
import properties from './graphql/properties.graphql'
import workCenters from './graphql/workCenters.graphql'
import workCentersFixed from './graphql/fixedWorkCenters.graphql'
import tasks from './graphql/tasks/tasks.graphql'
import downtimesPrevious from './graphql/downtimes/downtimesPrevious.graphql'
import documents from './graphql/qualities/documents.graphql'
import installations from './graphql/installations/installations.graphql'
import removeInstallation from './graphql/installations/removeInstallation.graphql'
import registerMaterialInstallation from './graphql/installations/registerMaterialInstallation.graphql'
import registerProduction from './graphql/tasks/registerProduction.graphql'
import cancelBeginRegistration from './graphql/tasks/cancelBeginRegistration.graphql'
import usersProductionEvents from './graphql/productions/usersProductionEvents.graphql'
import workCenterProductionEvents from './graphql/productions/workCenterProductionEvents.graphql'
import deleteProduction from './graphql/productions/deleteProduction.graphql'
import printLabel from './graphql/productions/printLabel.graphql'
import executeWriteOff from './graphql/productions/executeWriteOff.graphql'
import downtimeGetTypes from './graphql/downtimeGetTypes.graphql'
import ticket from './graphql/ticket.graphql'
import fixWorkCenterForWorker from './graphql/fixWorkCenterForWorker.graphql'
import unfixWorkCenterForWorker from './graphql/unfixWorkCenterForWorker.graphql'
import mobilityProperties from './graphql/mobilityProperties.graphql'

//formio
import productionFormio from './graphql/formio/productionForm.graphql'
import productionFormioSubmit from './graphql/formio/productionFormSubmit.graphql'

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
    return result.data.mes.properties
  }

  async getTicketFromGql () {
    const result = await getClient().query({
      query: gql` ${ticket}`
    })
    return result.data.mes.ticket
  }

  async getMobilityPropertiesFromGql(webAppId) {
    const result = await getClient().query({
      query: gql` query ($webAppId: String) ${mobilityProperties}`,
      variables: { webAppId }
    })
    return result.data.mes.mobilityProperties
  }

  async fixWorkCenterForWorkerGql(workCenterCode, workerCode) {
    const result = await getClient().mutate({
      mutation: gql`${fixWorkCenterForWorker}`,
      variables: { workCenterCode, workerCode }
    })
    return result.data.mesMutation.fixWorkCenterForWorker
  }

  async unfixWorkCenterForWorkerGql(fixationIds) {
    var fixationId = fixationIds.fixationId
    const result = await getClient().mutate({
      mutation: gql`${unfixWorkCenterForWorker}`,
      variables: { fixationId }
    })
    return result.data.mesMutation.unfixWorkCenterForWorker
  }

  async getWorkCentersFromGql(uuid, login, fetchPolicy) {
    const result = await getClient().query({
      query: gql` query ($uuid: String, $login: String) ${workCenters}`,
      variables: { uuid, login },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.mes.workCenters
  }

  async getWorkCentersFixedFromGql(workerCode, fetchPolicy) {
    const result = await getClient().query({
      query: gql` query ($workerCode: String) ${workCentersFixed}`,
      variables: { workerCode },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.mes.workCentersFixed
  }

  async getTasksFromGql(workCenter, fetchPolicy) {
    const result = await getClient().query({
      query: gql`query ($workCenter: String) ${tasks}`,
      variables: { workCenter },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.mes.tasks
  }

  async getDowntimesPreviousFromGql(workCenterCode, dateTime) {
    const result = await getClient().query({
      query: gql`query ($workCenterCode: String, $dateTime: DateTime) ${downtimesPrevious}`,
      variables: { workCenterCode, dateTime }
    })
    return result.data.mes.downtimePrevious.downtimeList
  }

  async getQualitiesFromGql(retrieveParams) {
    const result = await getClient().query({
      query: gql`query ($retrieveParams: ProcessRetrieveParamsInput!) ${documents}`,
      variables: { retrieveParams }
    })
    return result.data.mes.documents.processes
  }

  async getDocumentsFromGql(retrieveParams) {
    const result = await getClient().query({
      query: gql`query ($retrieveParams: ProcessRetrieveParamsInput!) ${documents}`,
      variables: { retrieveParams }
    })
    return result.data.mes.documents.processes
  }

  async getInstallationsFromGql(workCenter, fetchPolicy) {
    const result = await getClient().query({
      query: gql`query ($workCenter: String) ${installations}`,
      variables: { workCenter },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.mes.installations.installations
  }

  async removeInstallationGql(installationId) {
    const result = await getClient().mutate({
      mutation: gql`${removeInstallation}`,
      variables: { installationId }
    })
    return result.data.mesMutation.removeInstallation
  }

  async registerMaterialInstallationGql(workCenterCode, batchBarcode, factId) {
    const result = await getClient().mutate({
      mutation: gql`${registerMaterialInstallation}`,
      variables: { workCenterCode, batchBarcode, factId }
    })
    return result.data.mesMutation.registerMaterialInstallation
  }

  async registerProductionGql(productionRegistrationParam) {
    const result = await getClient().mutate({
      mutation: gql`${registerProduction}`,
      variables: { productionRegistrationParam }
    })
    return result.data.mesMutation.registerProduction
  }

  async cancelBeginRegistrationGql(taskId) {
    const result = await getClient().mutate({
      mutation: gql`${cancelBeginRegistration}`,
      variables: { taskId }
    })
    return result.data.mesMutation.cancelBeginRegistration
  }

  async getUsersProductionEventsFromGql(workerCode, fetchPolicy) {
    const result = await getClient().query({
      query: gql`query ($workerCode: String) ${usersProductionEvents}`,
      variables: { workerCode },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.mes.usersProductionEvents
  }

  async getWorkCenterProductionEventsFromGql(workCenterCode, fetchPolicy) {
    const result = await getClient().query({
      query: gql`query ($workCenterCode: String) ${workCenterProductionEvents}`,
      variables: { workCenterCode },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.mes.workCenterProductionEvents
  }

  async deleteProductionGql(factId) {
    const  result = await getClient().mutate({
      mutation: gql`${deleteProduction}`,
      variables: { factId }
    })
    return result.data.mesMutation.deleteProduction
  }

  async printProductionGql(factId, checkWriteOffPercent) {
    const  result = await getClient().mutate({
      mutation: gql`query ($factId: Int, $checkWriteOffPercent: Boolean) ${printLabel}`,
      variables: { factId, checkWriteOffPercent }
    })
    return result.data.mes.printLabel
  }

  async setMaterialProductionGql(factId, addAbsentInstallations, workCenterCode) {
    const  result = await getClient().mutate({
      mutation: gql`${executeWriteOff}`,
      variables: { factId, addAbsentInstallations, workCenterCode }
    })
    return result.data.mes.executeWriteOff
  }

  async getProductionFormioFromGql(formCode, properties) {
    const result = await getClient().query({
      query: gql`${productionFormio}`,
      variables: { formCode, properties },
      fetchPolicy: 'network-only'
    })
    return result.data.mes.productionFormio
  }

  async productionFormioSubmitGql(formCode, submission, properties) {
    const result = await getClient().mutate({
      mutation: gql`${productionFormioSubmit}`,
      variables: { formCode, submission, properties}
    })
    return result.data.mesMutation.productionFormioSubmit
  }

  async getDowntimeTypesFromGql() {
    const result = await getClient().query({
      query: gql` ${downtimeGetTypes}`
    })
    return result.data.mes.downtimeTypes
  }
}
