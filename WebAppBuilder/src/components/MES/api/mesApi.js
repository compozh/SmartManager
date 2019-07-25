import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag'
// Queries
import workCenters from './graphql/workCenters.graphql'
import tasks from './graphql/tasks.graphql'

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
}