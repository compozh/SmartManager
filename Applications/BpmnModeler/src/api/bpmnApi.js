import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import gql from 'graphql-tag';

import auth from '@it-enterprise/jwtauthentication';
import router from '@/router';

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

  async getItems(refetch) {
    const result = await query({
      query: gql`query ${queries.items}`,
      fetchPolicy: refetch === true ? 'network-only' : 'cache-first'
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
      mutation: gql`mutation ($accessParams: AccessParamsInput!) ${mutations.giveAccessToDiagram}`,
      variables: {
        accessParams: {
          recordId: accessParams.recordId,
          userId: accessParams.userId,
          groupId: accessParams.groupId,
          read: accessParams.read,
          write: accessParams.write,
          deploy: accessParams.deploy,
          execute: accessParams.execute,
          share: accessParams.share,
          inherit: accessParams.inherit
        }
      }
    });
    return result.data.bpmnqueryMutation.giveAccessToDiagram;
  }

  async editAccessToDiagram(accessParams) {
    const result = await mutate({
      mutation: gql`mutation ($accessParams: AccessParamsInput!) ${mutations.editAccessToDiagram}`,
      variables: {
        accessParams: {
          id: accessParams.id,
          recordId: accessParams.recordId,
          read: accessParams.read,
          write: accessParams.write,
          deploy: accessParams.deploy,
          execute: accessParams.execute,
          share: accessParams.share
        }
      }
    });
    return result.data.bpmnqueryMutation.editAccessToDiagram;
  }

  async removeAccessToDiagram(id) {
    const result = await mutate({
      mutation: gql`mutation ($accessParamsId: ID!) ${mutations.removeAccessToDiagram}`,
      variables: {
        accessParamsId: id
      }
    });
    return result.data.bpmnqueryMutation.removeAccessToDiagram;
  }

  async getAccessRecordsForFolder(folderId) {
    const result = await query({
      query: gql`query ($folderId: ID!) ${queries.getAccessRecordsForFolder}`,
      variables: { folderId },
      fetchPolicy: 'no-cache'
    });
    return result.data.bpmnquery.getAccessRecordsForFolder;
  }

  async giveAccessToFolder(accessParams) {
    const result = await mutate({
      mutation: gql`mutation ($accessParams: AccessParamsInput!) ${mutations.giveAccessToFolder}`,
      variables: {
        accessParams: {
          recordId: accessParams.recordId,
          userId: accessParams.userId,
          groupId: accessParams.groupId,
          read: accessParams.read,
          write: accessParams.write,
          deploy: accessParams.deploy,
          execute: accessParams.execute,
          share: accessParams.share,
          inherit: accessParams.inherit
        }
      }
    });
    return result.data.bpmnqueryMutation.giveAccessToFolder;
  }

  async editAccessToFolder(accessParams) {
    const result = await mutate({
      mutation: gql`mutation ($accessParams: AccessParamsInput!) ${mutations.editAccessToFolder}`,
      variables: {
        accessParams: {
          id: accessParams.id,
          recordId: accessParams.recordId,
          read: accessParams.read,
          write: accessParams.write,
          deploy: accessParams.deploy,
          execute: accessParams.execute,
          share: accessParams.share
        }
      }
    });
    return result.data.bpmnqueryMutation.editAccessToFolder;
  }

  async removeAccessToFolder(id) {
    const result = await mutate({
      mutation: gql`mutation ($accessParamsId: ID!) ${mutations.removeAccessToFolder}`,
      variables: {
        accessParamsId: id
      }
    });
    return result.data.bpmnqueryMutation.removeAccessToFolder;
  }

  //#endregion

  //#region Other

  async queryUsers() {
    const result = await query({
      query: gql`query ${queries.queryUsers}`
    });
    return result.data.bpmnquery.queryUsers;
  }

  async queryGroups() {
    const result = await query({
      query: gql`query ${queries.queryGroups}`
    });
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

  async getDeployedCases() {
    const result = await query({
      query: gql`query ${queries.getDeployedCases}`
    });
    return result.data.bpmnquery.deployedCases;
  }

  //#endregion

  //#region Versions

  async getVersionsForDiagram(diagramId) {
    const result = await query({
      query: gql`query ($diagramId : ID!) ${queries.getDiagramVersions}`,
      variables: { diagramId },
      fetchPolicy: 'no-cache'
    });
    return result.data.bpmnquery.diagramVersions;
  }

  async createDiagramVersion(diagramId) {
    const result = await mutate({
      mutation: gql`mutation ($diagramId: ID!) ${mutations.createDiagramVersion}`,
      variables: { diagramId }
    });
    return result.data.bpmnqueryMutation.createDiagramVersion;
  }

  async getDiagramVersionXml(diagramId, versionId) {
    const result = await query({
      query: gql`query ($diagramId: ID!, $versionId: ID!) ${queries.getDiagramVersionXml}`,
      variables: { diagramId, versionId }
    });
    return result.data.bpmnquery.diagramVersionXml;
  }

  async updateDiagramVersion(version) {
    const result = await mutate({
      mutation: gql`mutation (version: DiagramVersionInput!) ${mutations.updateDiagramVersion}`,
      variables: { diagramId: version.diagramId, versionId: version.versionId, name: version.versionId }
    });
    return result.data.bpmnqueryMutation.updateDiagramVersion;
  }

  async deleteDiagramVersion(diagramId, versionId) {
    const result = await mutate({
      mutation: gql`mutation ($diagramId: ID!, $versionId: ID!) ${mutations.deleteDiagramVersion}`,
      variables: { diagramId, versionId }
    });
    return result.data.bpmnqueryMutation.deleteDiagramVersion;
  }

  async applyDiagramVersion(diagramId, versionId) {
    const result = await mutate({
      mutation: gql`mutation ($diagramId: ID!, $versionId: ID!) ${mutations.applyDiagramVersion}`,
      variables: { diagramId, versionId }
    });
    const success = result.data.bpmnqueryMutation.applyDiagramVersion;
    if (success) {
      const xml = await this.getDiagramVersionXml(diagramId, versionId);
      if (typeof xml === 'string') {
        client.writeQuery({
          query: gql`query ($id: ID!) ${queries.getXml}`,
          variables: { id: diagramId },
          data: { bpmnquery: { getXml: xml, __typename: 'String' } }
        });
      }
      return xml;
    }
    return success;
  }

  //#endregion

  //#region BusinessObjects

  async getBusinessObjects(onlySystem) {
    const result = await query({
      query: gql`query ($onlySystem: Boolean!) ${queries.businessObjects}`,
      variables: { onlySystem }
    });
    return result.data.bpmnquery.businessObjects;
  }

  async getBusinessObjectActions(boDefCode, onlySystem) {
    const result = await query({
      query: gql`query ($boDefCode: String!, $onlySystem: Boolean!) ${queries.businessObjectActions}`,
      variables: { boDefCode, onlySystem }
    });
    return result.data.bpmnquery.businessObjectActions;
  }

  async getBusinessObjectAccess(boDefCode, onlySystem) {
    const result = await query({
      query: gql`query ($boDefCode: String!, $onlySystem: Boolean!) ${queries.businessObjectAccess}`,
      variables: { boDefCode, onlySystem }
    });
    return result.data.bpmnquery.businessObjectAccess;
  }

  //#endregion

}

export const api = new BpmnModelerApi();

/**
 * @param {import('apollo-client').QueryOptions} options 
 */
async function query(options) {
  const token = await auth.getToken();
  addAuthHeader(options, token);
  return await client.query(options);
}

/**
 * @param {import('apollo-client').MutationOptions} options 
 */
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
    if (router.currentRoute.name !== 'login') {
      router.push({path: '/login', query: {to: router.currentRoute.path }});
    }
  }
  if (networkError && networkError.statusCode == 500) {
    router.push({name: 'page-error', params: { status_code: '500'}}, () => {},() => {});
  }
  if (graphQLErrors) {
    return graphQLErrors.message;
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(new HttpLink({
    uri: window.config.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      'schema': 'bpmnmodeler'
    }
  }))
});