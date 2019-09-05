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
    const result = await getClient().query({
      query: gql`query ${models}`
    });
    return result.data.bpmnquery.models;
  }

  async create(model) {
    const result = await getClient().query({
      query: gql`query ($model: ModelInput!) ${create}`,
      variables: { model }
    });
    console.log(result);
    return result.data.bpmnmutation.create;
  }

  async getXml(id) {
    const result = await getClient().query({
      query: gql`query ($id: ID!) ${getXml}`,
      variables: { id }
    });
    return result.data.bpmnquery.getXml;
  }

  async setXml(id, xml) {
    const result = await getClient().query({
      query: gql`query ($id: ID!, $xml: String!) ${setXml}`,
      variables: { id, xml }
    });
    return result;
  }

  async setName(id, name) {
    const result = await getClient().query({
      query: gql`query ($id: ID!, $name : String!) ${setName}`,
      variables: { id, name }
    });
    return result.data.bpmnmutation.setName;
  }

  async deleteModel(id) {
    const result = await getClient().query({
      query: gql`query ($id: ID!) ${remove}`,
      variables: { id }
    });
    return result.data.bpmnmutation.delete;
  }
}
