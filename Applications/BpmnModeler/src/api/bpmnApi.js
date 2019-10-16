import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import gql from 'graphql-tag';
// Queries
import getConfiguration from './graphql/getConfiguration.graphql'
import items from './graphql/items.graphql';
import getXml from './graphql/getXml.graphql';
import setXml from './graphql/setXml.graphql';
import createProcess from './graphql/createProcess.graphql';
import editProcess from './graphql/editProcess.graphql';
import dropProcess from './graphql/dropProcess.graphql';
import removeProcess from './graphql/deleteProcess.graphql';
import deployProcess from './graphql/deployProcess.graphql'
import createFolder from './graphql/createFolder.graphql';
import editFolder from './graphql/editFolder.graphql';
import dropFolder from './graphql/dropFolder.graphql';
import removeFolder from './graphql/deleteFolder.graphql';
import getAvailableActions from './graphql/getAvailableActions.graphql'

import Vue from 'vue';

const getClient = () => {
  const authHeader = Vue.prototype.$authentication.getAuthHeader();
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
  constructor() { }
  
  async getConfiguration() {
    const result = await getClient().query({
      query: gql`query ${getConfiguration}`
    });
    return result.data.bpmnquery.getConfiguration;
  }

  async getItems() {
    const result = await getClient().query({
      query: gql`query ${items}`
    });
    return JSON.parse(result.data.bpmnquery.items);
  }

  async getXml(id) {
    const result = await getClient().query({
      query: gql`query ($id: ID!) ${getXml}`,
      variables: { id }
    });
    return result.data.bpmnquery.getXml;
  }

  async setXml(id, xml) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($id: ID!, $xml: String!) ${setXml}`,
      variables: { id, xml }
    });
    return result.data.bpmnqueryMutation.setXml;
  }

  async createProcess(process) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($process: ProcessInput!) ${createProcess}`,
      variables: { process }
    });
    return result.data.bpmnqueryMutation.createProcess;
  }

  async editProcess(process) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($process: ProcessInput!) ${editProcess}`,
      variables: { process: { id: process.id, name: process.name, parentId: process.parentId } }
    });
    return result.data.bpmnqueryMutation.editProcess;
  }

  async dropProcess(processId, parentId) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($processId: String!, $parentId: String) ${dropProcess}`,
      variables: { processId, parentId }
    });
    return result.data.bpmnqueryMutation.dropProcess;
  }

  async deleteProcess(id) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($id: ID!) ${removeProcess}`,
      variables: { id }
    });
    return result.data.bpmnqueryMutation.deleteProcess;
  }

  async deployProcess(id) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($id: ID!) ${deployProcess}`,
      variables: { id }
    });
    return result.data.bpmnqueryMutation.deployProcess;
  }

  async createFolder(folder) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($folder: FolderInput!) ${createFolder}`,
      variables: { folder: { id: folder.id, name: folder.name, parentId: folder.parentId, isSystem: folder.isSystem } }
    });
    return result.data.bpmnqueryMutation.createFolder;
  }

  async editFolder(folder) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($folder: FolderInput!) ${editFolder}`,
      variables: { folder: { id: folder.id, name: folder.name, parentId: folder.parentId } }
    });
    return result.data.bpmnqueryMutation.editFolder;
  }

  async dropFolder(folderId, parentId) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($folderId: String!, $parentId: String) ${dropFolder}`,
      variables: { folderId, parentId }
    });
    return result.data.bpmnqueryMutation.dropFolder;
  }

  async deleteFolder(id) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($id: ID!) ${removeFolder}`,
      variables: { id }
    });
    return result.data.bpmnqueryMutation.deleteFolder;
  }

  async getAvailableActions(processId, definitionType) {
    const result = await getClient().query({
      query: gql`query ($processId: ID!, $definitionType: ActionDefinitionType!) ${getAvailableActions}`,
      variables: { processId, definitionType }
    });
    return result.data.bpmnquery.getAvailableActions;
  }
}
