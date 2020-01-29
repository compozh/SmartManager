import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import gql from 'graphql-tag';

import auth from '@it-enterprise/jwtauthentication';
import router from '@/router';
import config from '../config';

// Queries
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

export class BpmnModelerApi {
  async reset() {
    await client.resetStore(); 
  }

  async getConfiguration() {
    const result = await query({
      query: gql`query ${queries.getConfiguration}`
    });
    return result.data.bpmnquery.getConfiguration;
  }

  async getItems() {
    const result = await query({
      query: gql`query ${queries.items}`
    });
    return JSON.parse(result.data.bpmnquery.items);
  }

  //#region Diagram

  async getXml(id) {
    const result = await query({
      query: gql`query ($id: ID!) ${queries.getXml}`,
      variables: { id }
    });
    return result.data.bpmnquery.getXml;
  }

  async setXml(id, xml) {
    const result = await mutate({
      mutation: gql`mutation ($id: ID!, $xml: String!) ${mutations.setXml}`,
      variables: { id, xml }
    });
    const success = result.data.bpmnqueryMutation.setXml;
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
    const result = await mutate({
      mutation: gql`mutation ($diagram: DiagramInput!) ${mutations.createDiagram}`,
      variables: { diagram: { name: diagram.name, parentId: diagram.parentId, isSystem: diagram.isSystem, type: diagram.type, xmlView: diagram.xmlView } }
    });
    return result.data.bpmnqueryMutation.createDiagram;
  }

  async editDiagram(diagram) {
    const result = await mutate({
      mutation: gql`mutation ($diagram: DiagramInput!) ${mutations.editDiagram}`,
      variables: { diagram: { id: diagram.id, name: diagram.name, parentId: diagram.parentId } }
    });
    return result.data.bpmnqueryMutation.editDiagram;
  }

  async moveDiagram(diagramId, parentId) {
    const result = await mutate({
      mutation: gql`mutation ($diagramId: ID!, $parentId: ID) ${mutations.moveDiagram}`,
      variables: { diagramId, parentId }
    });
    return result.data.bpmnqueryMutation.moveDiagram;
  }

  async deleteDiagram(id) {
    const result = await mutate({
      mutation: gql`mutation ($id: ID!) ${mutations.removeDiagram}`,
      variables: { id }
    });
    return result.data.bpmnqueryMutation.deleteDiagram;
  }

  async deployDiagram(id) {
    const result = await mutate({
      mutation: gql`mutation ($id: ID!) ${mutations.deployDiagram}`,
      variables: { id }
    });
    return result.data.bpmnqueryMutation.deployDiagram;
  }

  //#endregion

  //#region Folder

  async createFolder(folder) {
    const result = await mutate({
      mutation: gql`mutation ($folder: FolderInput!) ${mutations.createFolder}`,
      variables: { folder: { id: folder.id, name: folder.name, parentId: folder.parentId, isSystem: folder.isSystem } }
    });
    return result.data.bpmnqueryMutation.createFolder;
  }

  async editFolder(folder) {
    const result = await mutate({
      mutation: gql`mutation ($folder: FolderInput!) ${mutations.editFolder}`,
      variables: { folder: { id: folder.id, name: folder.name, parentId: folder.parentId } }
    });
    return result.data.bpmnqueryMutation.editFolder;
  }

  async moveFolder(folderId, parentId) {
    const result = await mutate({
      mutation: gql`mutation ($folderId: ID!, $parentId: ID) ${mutations.moveFolder}`,
      variables: { folderId, parentId }
    });
    return result.data.bpmnqueryMutation.moveFolder;
  }

  async deleteFolder(id) {
    const result = await mutate({
      mutation: gql`mutation ($id: ID!) ${mutations.removeFolder}`,
      variables: { id }
    });
    return result.data.bpmnqueryMutation.deleteFolder;
  }

  //#endregion

  //#region Access

  async getAccessRecordsForDiagram(diagramId) {
    const result = await query({
      query: gql`query ($diagramId: ID!) ${queries.getAccessRecordsForDiagram}`,
      variables: { diagramId },
      fetchPolicy: 'no-cache'
    });
    return result.data.bpmnquery.getAccessRecordsForDiagram;
  }

  async giveAccessToDiagram(accessParams) {
    const result = await mutate({
      mutation: gql`mutation ($accessParams: DiagramAccessParamsInput!) ${mutations.giveAccessToDiagram}`,
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
    return result.data.bpmnqueryMutation.giveAccessToDiagram;
  }

  async editAccessToDiagram(accessParams) {
    const result = await mutate({
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
    const result = await mutate({
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
    const result = await query({
      query: gql`query ${queries.queryUsers}`
    })
    return result.data.bpmnquery.queryUsers;
  }

  async queryGroups() {
    const result = await query({
      query: gql`query ${queries.queryGroups}`
    })
    return result.data.bpmnquery.queryGroups;
  }

  async getActions(definitionType, onlySystem) {
    const result = await query({
      query: gql`query ($definitionType: ActionDefinitionType!, $onlySystem: Boolean!) ${queries.getActions}`,
      variables: { definitionType, onlySystem }
    });
    return result.data.bpmnquery.getAvailableActions;
  }

  async getActionById(actionId) {
    const result = await query({
      query: gql`query ($actionId: ID!) ${queries.getActionById}`,
      variables: { actionId }
    });
    return result.data.bpmnquery.getActionById;
  }

  async getForms(onlySystem) {
    const result = await query({
      query: gql`query ($onlySystem: Boolean!) ${queries.getForms}`,
      variables: { onlySystem }
    });
    return result.data.bpmnquery.getFormsForProcess;
  }

  addForm(id, name) {
    const query = gql`query ($onlySystem: Boolean!) ${queries.getForms}`,
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

  async getDeployedProcesses() {
    const result = await query({
      query: gql`query ${queries.getDeployedProcesses}`
    });
    return result.data.bpmnquery.deployedProcesses;
  }

  async getDeployedDecisions() {
    const result = await query({
      query: gql`query ${queries.getDeployedDecisions}`
    });
    return result.data.bpmnquery.deployedDecisions;
  }

  //#endregion
}

export const api = new BpmnModelerApi();

async function query(options) {
  const token = await auth.getToken();
  addAuthHeader(options, token);
  return await client.query(options);
}

async function mutate(options) {
  const token = await auth.getToken();
  addAuthHeader(options, token);
  return await client.mutate(options);
}

function addAuthHeader(options, token) {
  if (!options.context) {
    options.context = {};
  }
  if (!options.context.headers) {
    options.context.headers = {};
  }
  options.context.headers['Authorization'] = `Bearer ${token}`;
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError && networkError.statusCode === 401) {
    auth.clearTokens();
    router.push({path: '/login', query: {to: router.currentRoute.path }});
  }
  if (graphQLErrors) {
    return graphQLErrors.message;
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(new HttpLink({
    uri: config.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      'schema': 'bpmnmodeler'
    }
  }))
});