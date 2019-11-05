import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import gql from 'graphql-tag';
// Queries
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

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
      query: gql`query ${queries.getConfiguration}`
    });
    return result.data.bpmnquery.getConfiguration;
  }

  async getItems() {
    const result = await getClient().query({
      query: gql`query ${queries.items}`
    });
    return JSON.parse(result.data.bpmnquery.items);
  }

  async getXml(id) {
    const result = await getClient().query({
      query: gql`query ($id: ID!) ${queries.getXml}`,
      variables: { id }
    });
    return result.data.bpmnquery.getXml;
  }

  async setXml(id, xml) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($id: ID!, $xml: String!) ${mutations.setXml}`,
      variables: { id, xml }
    });
    return result.data.bpmnqueryMutation.setXml;
  }

  async createProcess(process) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($process: ProcessInput!) ${mutations.createProcess}`,
      variables: { process }
    });
    return result.data.bpmnqueryMutation.createProcess;
  }

  async editProcess(process) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($process: ProcessInput!) ${mutations.editProcess}`,
      variables: { process: { id: process.id, name: process.name, parentId: process.parentId } }
    });
    return result.data.bpmnqueryMutation.editProcess;
  }

  async dropProcess(processId, parentId) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($processId: String!, $parentId: String) ${mutations.dropProcess}`,
      variables: { processId, parentId }
    });
    return result.data.bpmnqueryMutation.dropProcess;
  }

  async deleteProcess(id) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($id: ID!) ${mutations.removeProcess}`,
      variables: { id }
    });
    return result.data.bpmnqueryMutation.deleteProcess;
  }

  async deployProcess(id) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($id: ID!) ${mutations.deployProcess}`,
      variables: { id }
    });
    return result.data.bpmnqueryMutation.deployProcess;
  }

  async createFolder(folder) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($folder: FolderInput!) ${mutations.createFolder}`,
      variables: { folder: { id: folder.id, name: folder.name, parentId: folder.parentId, isSystem: folder.isSystem } }
    });
    return result.data.bpmnqueryMutation.createFolder;
  }

  async editFolder(folder) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($folder: FolderInput!) ${mutations.editFolder}`,
      variables: { folder: { id: folder.id, name: folder.name, parentId: folder.parentId } }
    });
    return result.data.bpmnqueryMutation.editFolder;
  }

  async dropFolder(folderId, parentId) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($folderId: String!, $parentId: String) ${mutations.dropFolder}`,
      variables: { folderId, parentId }
    });
    return result.data.bpmnqueryMutation.dropFolder;
  }

  async deleteFolder(id) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($id: ID!) ${mutations.removeFolder}`,
      variables: { id }
    });
    return result.data.bpmnqueryMutation.deleteFolder;
  }

  async getAvailableActions(processId, definitionType) {
    const result = await getClient().query({
      query: gql`query ($processId: ID!, $definitionType: ActionDefinitionType!) ${queries.getAvailableActions}`,
      variables: { processId, definitionType }
    });
    return result.data.bpmnquery.getAvailableActions;
  }

  async getActionById(actionId) {
    const result = await getClient().query({
      query: gql`query ($actionId: ID!) ${queries.getActionById}`,
      variables: { actionId }
    });
    return result.data.bpmnquery.getActionById;
  }

  async getFormsForProcess(processId) {
    const result = await getClient().query({
      query: gql`query ($processId: ID!) ${queries.getFormsForProcess}`,
      variables: { processId }
    });
    return result.data.bpmnquery.getFormsForProcess;
  }

  //#region Access

  async getAccessRecordsForProcess(processId) {
    const result = await getClient().query({
      query: gql`query ($processId: String!) ${queries.getAccessRecordsForProcess}`,
      variables: { processId }
    });
    return result.data.bpmnquery.getAccessRecordsForProcess;
  }

  async giveAccessToProcess(accessParams) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($accessParams: DiagramAccessInput!) ${mutations.giveAccessToProcess}`,
      variables: {
        accessParams: {
          recordId: accessParams.recordId,
          userId: accessParams.userId,
          groupId: accessParams.groupId,
          allowAccess: accessParams.allowAccess,
          rights: accessParams.rights
        }
      }
    });
    return result.data.bpmnqueryMutation.giveAccessToProcess;
  }

  async editAccessToProcess(accessParams) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($accessParams: DiagramAccessInput!) ${mutations.editAccessToProcess}`,
      variables: {
        accessParams: {
          recordId: accessParams.recordId,
          userId: accessParams.userId,
          groupId: accessParams.groupId,
          allowAccess: accessParams.allowAccess,
          rights: accessParams.rights
        }
      }
    });
    return result.data.bpmnqueryMutation.editAccessToProcess;
  }

  async removeAccessToProcess(accessParams) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($accessParams: DiagramAccessInput!) ${mutations.removeAccessToProcess}`,
      variables: {
        accessParams: {
          recordId: accessParams.recordId,
          userId: accessParams.userId,
          groupId: accessParams.groupId,
          allowAccess: accessParams.allowAccess,
          rights: accessParams.rights
        }
      }
    });
    return result.data.bpmnqueryMutation.removeAccessToProcess;
  }

  //#endregion

  //#region Other

  async queryUsers() {
    const result = await getClient().query({
      query: gql`query ${queries.queryUsers}`
    })
    return result.data.bpmnquery.queryUsers;
  }

  async queryGroups() {
    const result = await getClient().query({
      query: gql`query ${queries.queryGroups}`
    })
    return result.data.bpmnquery.queryGroups;
  }

  //#endregion

}
