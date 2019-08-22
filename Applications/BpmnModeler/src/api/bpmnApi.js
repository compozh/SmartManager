import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import gql from 'graphql-tag';
// Queries
import models from './graphql/models.graphql';
import create from './graphql/create.graphql';
import getXml from './graphql/getXml.graphql';
import setXml from './graphql/setXml.graphql';
import setName from './graphql/setName.graphql';
import remove from './graphql/delete.graphql';

import Vue from 'vue';

const getClient = () => {
  const authHeader =  Vue.prototype.$authentication.getAuthHeader();
  const options = {
    // eslint-disable-next-line no-undef
    uri: myConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      ...authHeader,
      'schema': 'bpmnmodeler'
    }
  };
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  });
};

export class BpmnModelerApi {
  constructor() {}

  async get() {
    try {
      const result = await getClient().query({
        query: gql`query ${models}`
      });
      return result.data.bpmnquery.models;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async create() {
    try {
      const result = await getClient().query({
        query: gql`query ${create}`,
      });
      return result;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async getXml(id) {
    try {
      const result = await getClient().query({
        query: gql`query ($id: ID!) ${getXml}`,
        variables: { id }
      });
      return result.data.bpmnquery.getXml;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async setXml(id, xml) {
    try {
      const result = await getClient().query({
        query: gql`query ($id: ID!, $xml: String!) ${setXml}`,
        variables: { id, xml }
      });
      return result;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async setName(id, name) {
    try {
      return await getClient().query({
        query: gql`query ($id: ID!, name : String!) ${setName}`,
        variables: { id, name }
      })
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async deleteModel(id) {
    try {
      return await getClient().query({
        query: gql`query ($id: ID!) ${remove}`,
        variables: { id }
      })
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}
