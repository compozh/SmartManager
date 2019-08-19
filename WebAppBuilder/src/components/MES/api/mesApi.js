import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag'

// Queries
import properties from './graphql/properties.graphql'
import workCenters from './graphql/workCenters.graphql'
import tasks from './graphql/tasks/tasks.graphql'
import installations from './graphql/installations/installations.graphql'
import removeInstallation from './graphql/installations/removeInstallation.graphql'
import registerMaterialInstallation from './graphql/installations/registerMaterialInstallation.graphql'
import registerProduction from './graphql/tasks/registerProduction.graphql'
import cancelBeginRegistration from './graphql/tasks/cancelBeginRegistration.graphql'
import productions from './graphql/productions/productions.graphql'
import deleteProduction from './graphql/productions/deleteProduction.graphql'
import productionFormIo from './graphql/productionFormIo.graphql'
import productionFormIoSubmit from './graphql/productionFormIoSubmit.graphql'
import ticket from './graphql/ticket.graphql'
import fixWorkCenterForWorker from './graphql/fixWorkCenterForWorker.graphql'

var client = null;
const getClient = () => {
  if(client == null) {
    const options = {
      uri: myConfig.GrapgQlUrl + 'api/graphql',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken'),
        'schema': 'mes'
      }
    }
    client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink(options)
    });
  }
  return client;
}

export class MesApi {
  constructor() {}

  async getPropertiesFromGql() {
    try {
        return await getClient().query({
        query: gql` ${properties}`
        }
      )
      .then(result => result)
      .catch(error => console.log(error.message));
    }
    catch (error) {
      return console.log(error.message);
    }
  }

  async getTicketFromGql() {
    try {
      return await getClient().query({
        query: gql` ${ticket}`
      });
    }
    catch (error) {
      return console.log(error.message);
    }
  }

  async fixWorkCenterForWorkerGql(workCenterCode, workerCode) {
    try {
      let result = await getClient().mutate({
        mutation: gql`${fixWorkCenterForWorker}`,
        variables: { workCenterCode, workerCode }
      });

      return result.data.mesMutation.fixWorkCenterForWorker;
    } catch (error) {
      return console.log(error.message);
    }
  }

  async getWorkCentersFromGql(uuid, login, fetchPolicy) {
    try {
      const result = await getClient().query({
        query: gql` query ($uuid: String, $login: String) ${workCenters}`,
        variables: { uuid, login },
        fetchPolicy: fetchPolicy || 'cache-first'
      });
      return result.data.mes.workCenters;
    }
    catch (error) {
      return console.log(error.message);
    }
  }

  async getTasksFromGql(workCenter, fetchPolicy) {
    try {
      const result = await getClient().query({
        query: gql`query ($workCenter: String) ${tasks}`,
        variables: { workCenter },
        fetchPolicy: fetchPolicy || 'cache-first'
      });
      return result.data.mes.tasks;
    }
    catch (error) {
      return console.log(error.message);
    }
  }

  async getInstallationsFromGql(workCenter, fetchPolicy) {
    try {
      const result = await getClient().query({
        query: gql`query ($workCenter: String) ${installations}`,
        variables: { workCenter },
        fetchPolicy: fetchPolicy || 'cache-first'
      });
      return result.data.mes.installations.installations;
    }
    catch (error) {
      return console.log(error.message);
    }
  }

  async removeInstallationGql(installationId) {
    try {
      let result = await getClient().mutate({
        mutation: gql`${removeInstallation}`,
        variables: { installationId }
      });
      return result.data.mesMutation.removeInstallation;
    } catch (error) {
      return console.log(error.message);
    }
  }

  async registerMaterialInstallationGql(workCenterCode, batchBarcode, factId) {
    try {
      let result = await getClient().mutate({
        mutation: gql`${registerMaterialInstallation}`,
        variables: { workCenterCode, batchBarcode, factId }
      });
      return result.data.mesMutation.registerMaterialInstallation;
    } catch (error) {
      return console.log(error.message);
    }
  }

  async registerProductionGql(productionRegistrationParam){
    try {
      let result = await getClient().mutate({
        mutation: gql`${registerProduction}`,
        variables: { productionRegistrationParam }
      });

      return result.data.mesMutation.registerProduction;
    } catch (error) {
      return console.log(error.message);
    }
  }
  async cancelBeginRegistrationGql(taskId){
    try {
      let result = await getClient().mutate({
        mutation: gql`${cancelBeginRegistration}`,
        variables: { taskId }
      });
      return result.data.mesMutation.cancelBeginRegistration;
    } catch (error) {
      return console.log(error.message);
    }
  }
  async getProductionsFromGql(workerCode, fetchPolicy) {
    try {
      const result = await getClient().query({
        query: gql`query ($workerCode: String) ${productions}`,
        variables: { workerCode },
        fetchPolicy: fetchPolicy || 'cache-first'
      });
      return result.data.mes.usersProductionEvents;
    }
    catch (error) {
      return console.log(error.message);
    }
  }
  async deleteProductionGql(factId) {
    try {
      let result = await getClient().mutate({
        mutation: gql`${deleteProduction}`,
        variables: { factId }
      });
      return result.data.mesMutation.deleteProduction;
    } catch (error) {
      return console.log(error.message);
    }
  }
  async getProductionFormioFromGql(formCode, properties) {
    try {
      const result = await getClient().query({
        query: gql`query ($formCode: String, $properties: ProductionRegistrationParamsInput!) ${productionFormIo}`,
        variables: { formCode, properties },
        fetchPolicy: 'network-only'
      });
      return result.data.mes.productionFormIo;
    }
    catch (error) {
      return console.log(error.message);
    }
  }
  async productionFormIoSubmitGql({ formCode, data, productionRegistrationParam}) {
    try {
      let result = await getClient().mutate({
        mutation: gql`${productionFormIoSubmit}`,
        variables: { formCode, data, productionRegistrationParam}
      });
      return result.data.mesMutation.productionFormIoSubmit;
    } catch (error) {
      return console.log(error.message);
    }
  }
}