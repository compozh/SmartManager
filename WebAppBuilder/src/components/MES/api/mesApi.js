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

const options = {
  uri: myConfig.GrapgQlUrl + 'api/graphql',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken'),
    'schema': 'mes'
  }
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink(options)
})

export class MesApi {
  constructor() {}

  async getPropertiesFromGql() {
    try {
        return await client.query({
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

  async getWorkCentersFromGql(uuid, login) {
    try {
      const result = await client.query({
        query: gql` query ($uuid: String, $login: String) ${workCenters}`,
        variables: { uuid, login }
      });
      return result;
    }
    catch (error) {
      return console.log(error.message);
    }
  }

  async getTasksFromGql(workCenter) {
    try {
      const result = await client.query({
        query: gql`query ($workCenter: String) ${tasks}`,
        variables: { workCenter }
      });
      return result;
    }
    catch (error) {
      return console.log(error.message);
    }
  }

  async getInstallationsFromGql(workCenter) {
    try {
      const result = await client.query({
        query: gql`query ($workCenter: String) ${installations}`,
        variables: { workCenter }
      });
      return result;
    }
    catch (error) {
      return console.log(error.message);
    }
  }

  async updateInstallationsFromGql(workCenter) {
    try {
      const result = await client.query({
        query: gql`query ($workCenter: String) ${installations}`,
        variables: { workCenter },
        fetchPolicy: 'network-only'
      });
      return result;
    }
    catch (error) {
      return console.log(error.message);
    }
  }

  async removeInstallationGql(installationId) {
    try {
      let result = await client.mutate({
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
      let result = await client.mutate({
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
      let result = await client.mutate({
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
      let result = await client.mutate({
        mutation: gql`${cancelBeginRegistration}`,
        variables: { taskId }
      });
      return result.data.mesMutation.cancelBeginRegistration;
    } catch (error) {
      return console.log(error.message);
    }
  }
  async getProductionsFromGql(workerCode) {
    try {
      const result = await client.query({
        query: gql`query ($workerCode: String) ${productions}`,
        variables: { workerCode }
      });
      return result;
    }
    catch (error) {
      return console.log(error.message);
    }
  }
  async deleteProductionGql(factId) {
    try {
      let result = await client.mutate({
        mutation: gql`${deleteProduction}`,
        variables: { factId }
      });
      return result.data.mesMutation.deleteProduction;
    } catch (error) {
      return console.log(error.message);
    }
  }
  async getProductionFormioFromGql(workCenterCode) {
    try {
      const result = await client.query({
        query: gql`query ($workCenterCode: String) ${productionFormIo}`,
        variables: { workCenterCode }
      });
      return result;
    }
    catch (error) {
      return console.log(error.message);
    }
  }
}