import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import gql from 'graphql-tag';
// Queries
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

import Vue from 'vue';

var client;

/**
 * @returns {ApolloClient}
 */
const getClient = () => {
  if (!client) {
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
    client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink(options)
    });
  }
  return client; 
};

export class BpmnModelerApi {
  constructor() { }
  
  async reset() {
    await getClient().resetStore(); 
  }

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

  //#region Diagram

  async getXml(id) {
    const result = await getClient().query({
      query: gql`query ($id: ID!) ${queries.getXml}`,
      variables: { id }
    });
    return result.data.bpmnquery.getXml;
  }

  async setXml(id, xml) {
    const client = getClient(),
      result = await client.mutate({
        mutation: gql`mutation ($id: ID!, $xml: String!) ${mutations.setXml}`,
        variables: { id, xml }
      }),
      success = result.data.bpmnqueryMutation.setXml;
    if (success) {
      client.writeQuery({
        query: gql`query ($id: ID!) ${queries.getXml}`,
        variables: { id },
        data: { bpmnquery: { getXml: xml, __typename: 'String' } }
      });
    }
    return success;
  }

  async createDiagram(diagram) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($diagram: DiagramInput!) ${mutations.createDiagram}`,
      variables: { diagram: { name: diagram.name, parentId: diagram.parentId, isSystem: diagram.isSystem, type: diagram.type, xmlView: diagram.xmlView } }
    });
    return result.data.bpmnqueryMutation.createDiagram;
  }

  async editDiagram(diagram) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($diagram: DiagramInput!) ${mutations.editDiagram}`,
      variables: { diagram: { id: diagram.id, name: diagram.name, parentId: diagram.parentId } }
    });
    return result.data.bpmnqueryMutation.editDiagram;
  }

  async moveDiagram(diagramId, parentId) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($diagramId: ID!, $parentId: ID) ${mutations.moveDiagram}`,
      variables: { diagramId, parentId }
    });
    return result.data.bpmnqueryMutation.moveDiagram;
  }

  async deleteDiagram(id) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($id: ID!) ${mutations.removeDiagram}`,
      variables: { id }
    });
    return result.data.bpmnqueryMutation.deleteDiagram;
  }

  async deployDiagram(id) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($id: ID!) ${mutations.deployDiagram}`,
      variables: { id }
    });
    return result.data.bpmnqueryMutation.deployDiagram;
  }

  //#endregion

  //#region Folder

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

  async moveFolder(folderId, parentId) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($folderId: ID!, $parentId: ID) ${mutations.moveFolder}`,
      variables: { folderId, parentId }
    });
    return result.data.bpmnqueryMutation.moveFolder;
  }

  async deleteFolder(id) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($id: ID!) ${mutations.removeFolder}`,
      variables: { id }
    });
    return result.data.bpmnqueryMutation.deleteFolder;
  }

  //#endregion

  //#region Access

  async getAccessRecordsForDiagram(diagramId) {
    const result = await getClient().query({
      query: gql`query ($diagramId: ID!) ${queries.getAccessRecordsForDiagram}`,
      variables: { diagramId }
    });
    return result.data.bpmnquery.getAccessRecordsForDiagram;
  }

  async giveAccessToDiagram(accessParams) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($accessParams: DiagramAccessParamsInput!) ${mutations.giveAccessToDiagram}`,
      variables: {
        accessParams: {
          recordId: accessParams.recordId,
          userId: accessParams.userId,
          groupId: accessParams.groupId,
          allowAccess: accessParams.allowAccess,
          rights: accessParams.rights
        }
      },
      fetchPolicy: 'no-cache'
    });
    return result.data.bpmnqueryMutation.giveAccessToDiagram;
  }

  async editAccessToDiagram(accessParams) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($accessParams: DiagramAccessParamsInput!) ${mutations.editAccessToDiagram}`,
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
    return result.data.bpmnqueryMutation.editAccessToDiagram;
  }

  async removeAccessToDiagram(accessParams) {
    const result = await getClient().mutate({
      mutation: gql`mutation ($accessParams: DiagramAccessParamsInput!) ${mutations.removeAccessToDiagram}`,
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
    return result.data.bpmnqueryMutation.removeAccessToDiagram;
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

  async getActions(definitionType, onlySystem) {
    const result = await getClient().query({
      query: gql`query ($definitionType: ActionDefinitionType!, $onlySystem: Boolean!) ${queries.getActions}`,
      variables: { definitionType, onlySystem }
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

  async getForms(onlySystem) {
    const result = await getClient().query({
      query: gql`query ($onlySystem: Boolean!) ${queries.getForms}`,
      variables: { onlySystem }
    });
    return result.data.bpmnquery.getFormsForProcess;
  }

  addForm(id, name) {
    const client = getClient(),
      query = gql`query ($onlySystem: Boolean!) ${queries.getForms}`,
      variables = { onlySystem: false },
      result = client.readQuery({
        query,
        variables
      });
    result.bpmnquery.getFormsForProcess.push({
      id: id,
      name: name,
      __typename: 'FormIO'
    });
    client.writeQuery({
      query,
      variables,
      data: result
    });
  }

  //#endregion

}

export const api = new BpmnModelerApi();
