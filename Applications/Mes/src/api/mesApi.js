import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import {onError} from 'apollo-link-error'
import gql from 'graphql-tag'
import auth from '@it-enterprise/jwtauthentication'
import {routerDependencies} from '@/router'

const router = routerDependencies.router

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
import registerMaterialInstallation
  from './graphql/installations/registerMaterialInstallation.graphql'
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

//formio
import productionFormio from './graphql/formio/productionForm.graphql'
import productionFormioSubmit from './graphql/formio/productionFormSubmit.graphql'
import downtimeFormio from './graphql/formio/downtimeForm.graphql'
import downtimeFormioSubmit from './graphql/formio/downtimeFormSubmit.graphql'
import qualityFormio from './graphql/formio/qualityForm.graphql'
import qualityFormioSubmit from './graphql/formio/qualityFormSubmit.graphql'

const errorLink = onError(({graphQLErrors, networkError}) => {
  if (networkError && networkError.statusCode === 401) {
    auth.clearTokens()
    router.push('/MES/LOGIN')
  }
  if (graphQLErrors) {
    // TODO: Обработать ошибку
    return graphQLErrors.message
  }
})

const getClient = async () => {
  const token = await auth.getToken()
  const options = {
    // eslint-disable-next-line no-undef
    uri: myConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${token}`,
      'schema': 'mes'
    }
  }
  const httpLink = new HttpLink(options)
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(httpLink)
  })
}

export class MesApi {

  async getPropertiesFromGql() {
    const client = await getClient()
    const result = await client.query({
      query: gql` ${properties}`
    })
    return result.data.mes.properties
  }

  async getTicketFromGql() {
    const client = await getClient()
    const result = await client.query({
      query: gql` ${ticket}`
    })
    return result.data.mes.ticket
  }

  async fixWorkCenterForWorkerGql(workCenterCode, workerCode) {
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${fixWorkCenterForWorker}`,
      variables: {workCenterCode, workerCode}
    })
    return result.data.mesMutation.fixWorkCenterForWorker
  }

  async unfixWorkCenterForWorkerGql(fixationIds) {
    var fixationId = fixationIds.fixationId
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${unfixWorkCenterForWorker}`,
      variables: {fixationId}
    })
    return result.data.mesMutation.unfixWorkCenterForWorker
  }

  async getWorkCentersFromGql(uuid, login, fetchPolicy) {
    const client = await getClient()
    const result = await client.query({
      query: gql` query ($uuid: String, $login: String) ${workCenters}`,
      variables: {uuid, login},
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.mes.workCenters
  }

  async getWorkCentersFixedFromGql(workerCode, fetchPolicy) {
    const client = await getClient()
    const result = await client.query({
      query: gql` query ($workerCode: String) ${workCentersFixed}`,
      variables: {workerCode},
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.mes.workCentersFixed
  }

  async getTasksFromGql(workCenter, fetchPolicy) {
    const client = await getClient()
    const result = await client.query({
      query: gql`query ($workCenter: String) ${tasks}`,
      variables: {workCenter},
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.mes.tasks
  }

  async getDowntimesPreviousFromGql(workCenterCode, dateTime) {
    const client = await getClient()
    const result = await client.query({
      query: gql`query ($workCenterCode: String, $dateTime: DateTime) ${downtimesPrevious}`,
      variables: {workCenterCode, dateTime}
    })
    return result.data.mes.downtimePrevious.downtimeList
  }

  async getQualitiesFromGql(retrieveParams) {
    const client = await getClient()
    const result = await client.query({
      query: gql`query ($retrieveParams: ProcessRetrieveParamsInput!) ${documents}`,
      variables: {retrieveParams}
    })
    return result.data.mes.documents.processes
  }

  async getInstallationsFromGql(workCenter, fetchPolicy) {
    const client = await getClient()
    const result = await client.query({
      query: gql`query ($workCenter: String) ${installations}`,
      variables: {workCenter},
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.mes.installations.installations
  }

  async removeInstallationGql(installationId) {
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${removeInstallation}`,
      variables: {installationId}
    })
    return result.data.mesMutation.removeInstallation
  }

  async registerMaterialInstallationGql(workCenterCode, batchBarcode, factId) {
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${registerMaterialInstallation}`,
      variables: {workCenterCode, batchBarcode, factId}
    })
    return result.data.mesMutation.registerMaterialInstallation
  }

  async registerProductionGql(productionRegistrationParam) {
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${registerProduction}`,
      variables: {productionRegistrationParam}
    })
    return result.data.mesMutation.registerProduction
  }

  async cancelBeginRegistrationGql(taskId) {
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${cancelBeginRegistration}`,
      variables: {taskId}
    })
    return result.data.mesMutation.cancelBeginRegistration
  }

  async getUsersProductionEventsFromGql(workerCode, fetchPolicy) {
    const client = await getClient()
    const result = await client.query({
      query: gql`query ($workerCode: String) ${usersProductionEvents}`,
      variables: {workerCode},
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.mes.usersProductionEvents
  }

  async getWorkCenterProductionEventsFromGql(workCenterCode, fetchPolicy) {
    const client = await getClient()
    const result = await client.query({
      query: gql`query ($workCenterCode: String) ${workCenterProductionEvents}`,
      variables: {workCenterCode},
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.mes.workCenterProductionEvents
  }

  async deleteProductionGql(factId) {
    const result = await getClient().mutate({
      mutation: gql`${deleteProduction}`,
      variables: {factId}
    })
    return result.data.mesMutation.deleteProduction
  }

  async printProductionGql(factId, checkWriteOffPercent) {
    const result = await getClient().mutate({
      mutation: gql`query ($factId: Int, $checkWriteOffPercent: Boolean) ${printLabel}`,
      variables: {factId, checkWriteOffPercent}
    })
    return result.data.mes.printLabel
  }

  async setMaterialProductionGql(factId, addAbsentInstallations, workCenterCode) {
    const result = await getClient().mutate({
      mutation: gql`${executeWriteOff}`,
      variables: {factId, addAbsentInstallations, workCenterCode}
    })
    return result.data.mes.executeWriteOff
  }

  async getProductionFormioFromGql(formCode, properties) {
    const client = await getClient()
    const result = await client.query({
      query: gql`${productionFormio}`,
      variables: {formCode, properties},
      fetchPolicy: 'network-only'
    })
    return result.data.mes.productionFormio
  }

  async productionFormioSubmitGql(formCode, submission, properties) {
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${productionFormioSubmit}`,
      variables: {formCode, submission, properties}
    })
    return result.data.mesMutation.productionFormioSubmit
  }

  async getDowntimeFormioFromGql(formCode, properties) {
    const client = await getClient()
    const result = await client.query({
      query: gql`${downtimeFormio}`,
      variables: {formCode, properties},
      fetchPolicy: 'network-only'
    })
    return result.data.mes.downtimeFormio
  }

  async getQualityFormioFromGql(formCode, properties) {
    const client = await getClient()
    const result = await client.query({
      query: gql`${qualityFormio}`,
      variables: {formCode, properties},
      fetchPolicy: 'network-only'
    })
    return result.data.mes.getFormio
  }

  async downtimeFormioSubmitGql(formCode, submission, properties) {
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${downtimeFormioSubmit}`,
      variables: {formCode, submission, properties}
    })
    return result.data.mesMutation.downtimeFormioSubmit
  }

  async qualityFormioSubmitGql(formCode, submission, properties) {
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${qualityFormioSubmit}`,
      variables: {formCode, submission, properties}
    })
    return result.data.mesMutation.qualityFormioSubmit
  }

  async getDowntimeTypesFromGql() {
    const client = await getClient()
    const result = await client.query({
      query: gql` ${downtimeGetTypes}`
    })
    return result.data.mes.downtimeTypes
  }
}
