/* eslint-disable require-atomic-updates */
import { api } from '../api/bpmnApi';
import { Folder, Diagram, Configuration, ActionDefinition, AccessParams, DiagramVersion } from '../api/models';

export default {
  async resetCache() {
    try {
      await api.reset();
    } catch {
      //
    }
  },
  async setActiveItem(context, item) {
    if (typeof item === 'string' || item instanceof String) {
      ({ item } = context.getters.getItemById(item));
    }
    context.state.activeItem = item;
  },
  async loadConfiguration(context) {
    let configuration;
    try {
      configuration = await api.getConfiguration();
    } catch (error) {
      console.error(error);
    }
    context.state.configuration = new Configuration(configuration);
  },
  async loadItems(context, refetch) {
    let items;
    try {
      items = await api.getItems(refetch);
    } catch (error) {
      console.error(error);
      return false;
    }
    if (!items) {
      return false;
    }

    const mapTree = (items) => items.map(e => {
      if (e.$type.startsWith('Folder')) {
        e.items = mapTree(e.items);
        return new Folder(e);
      } else {
        return new Diagram(e);
      }
    });
    items = mapTree(items);
    context.commit('setItems', items);
    await context.dispatch('checkForOwnFolder');
    return true;
  },
  async checkForOwnFolder(context) {
    const folderExisit = context.state.items.findIndex(item => item instanceof Folder && item.ownerId === context.rootState.auth.user.id) >= 0;
    if (folderExisit) {
      return;
    }
    await context.dispatch('createFolder', new Folder({ name: context.rootState.auth.user.userName }));
  },
  //#region Diagrams

  async getXml(context, id) {
    let xml;
    try {
      xml = await api.getXml(id);
    } catch (error) {
      console.error(error);
      return false;
    }
    return xml;
  },
  async setXml(context, { id, xml }) {
    let success = false;
    try {
      success = await api.setXml(id, xml);
    } catch (error) {
      console.error(error);
    }
    return success;
  },
  async createProcess(context, diagram) {
    let newDiagram;
    if (diagram.parentId && diagram.parentId.length > 0) {
      var { item: parent } = context.getters.getItemById(diagram.parentId);
      if (diagram.isSystem && !parent.isSystem) {
        return false;
      }
    }
    try {
      newDiagram = await api.createDiagram(diagram);
    } catch (error) {
      console.error(error);
      return false;
    }
    if (!newDiagram) {
      return false;
    }
    Object.assign(diagram, newDiagram);
    return true;
  },
  async editProcess(context, { id, name }) {
    const { item: process } = context.getters.getItemById(id);
    const oldName = process.name;
    process.name = name;

    let success = false;
    try {
      success = await api.editDiagram(process);
    } catch (error) {
      console.error(error);
    }
    if (!success) {
      process.name = oldName;
    }
    return success;
  },
  async deployProcess(context, id) {
    let result;
    try {
      result = await api.deployDiagram(id);
    } catch (error) {
      console.error(error);
    }
    if (!result) {
      result = { success: false };
    }
    if (!result.success) {
      console.error(result);
    }
    return result;
  },
  async copyProcess(context, process) {
    try {
      process.xmlView = await context.dispatch('getXml', process.id);
      return await context.dispatch('createProcess', process);
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async getAvailableActions(context, { processId: id, definitionType }) {
    const { item: diagram } = context.getters.getItemById(id);
    let items;
    try {
      items = await api.getActions(definitionType, diagram.isSystem);
    } catch (error) {
      console.error(error);
    }
    if (!items) {
      return false;
    }
    return items;
  },
  async getFormsForProcess(context, { processId: id }) {
    const { item: diagram } = context.getters.getItemById(id);
    let items;
    try {
      items = await api.getForms(diagram.isSystem);
    } catch (error) {
      console.error(error);
    }
    if (!items) {
      return false;
    }
    return items;
  },
  async getActionById(context, actionId) {
    let item;
    try {
      item = await api.getActionById(actionId);
    } catch (error) {
      console.error(error);
    }
    if (!item) {
      return false;
    }
    return new ActionDefinition(item);
  },

  //#endregion

  //#region Folders

  async createFolder(context, folder) {
    let newFolder;
    if (folder.parentId && folder.parentId.length > 0) {
      var { item: parent } = context.getters.getItemById(folder.parentId);
      if (folder.isSystem && !parent.isSystem) {
        return false;
      }
    }
    try {
      newFolder = await api.createFolder(folder);
    } catch (error) {
      console.error(error);
      return false;
    }
    if (!newFolder) {
      return false;
    }
    Object.assign(folder, newFolder);

    return true;
  },
  async editFolder(context, { id, name }) {
    const { item: folder } = context.getters.getItemById(id);
    const oldName = folder.name;
    folder.name = name;

    let success = false;
    try {
      success = await api.editFolder(folder);
    } catch (error) {
      console.error(error);
    }
    if (!success) {
      folder.name = oldName;
    }
    return success;
  },
  async copyFolder(context, folder) {
    try {
      return await context.dispatch('createFolder', folder);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  //#endregion

  //#region Common

  async deleteItem(context, { id }) {
    const { item, index } = context.getters.getItemById(id);
    if (index < 0) {
      return false;
    }
    let success = false;
    try {
      if (item instanceof Folder) {
        success = await api.deleteFolder(id);
      } else {
        success = await api.deleteDiagram(id);
      }
    } catch (error) {
      console.error(error);
    }
    return success;
  },
  async itemDropped(context, { draggingItem, dropItem, type }) {
    let success = false;
    try {
      if (draggingItem.isFolder) {
        success = await api.moveFolder(draggingItem.id, dropItem.id);
      } else {
        success = await api.moveDiagram(draggingItem.id, dropItem.id);
      }
    } catch (error) {
      console.error(error);
    }
    return success;
  },

  //#endregion

  //#region Access

  async getAccessRecordsForDiagram(context, diagramId) {
    let records;
    try {
      records = await api.getAccessRecordsForDiagram(diagramId);
    } catch (error) {
      console.error(error);
      return false;
    }
    if (records) {
      return records.map(record => new AccessParams(record));
    } else {
      return records;
    }
  },

  async giveAccessToDiagram(context, accessParams) {
    try {
      var result = await api.giveAccessToDiagram(accessParams);
      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async editAccessToDiagram(context, accessParams) {
    try {
      return await api.editAccessToDiagram(accessParams);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async removeAccessToDiagram(context, accessParams) {
    try {
      return await api.removeAccessToDiagram(accessParams.id);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async getAccessRecordsForFolder(context, folderId) {
    let records;
    try {
      records = await api.getAccessRecordsForFolder(folderId);
    } catch (error) {
      console.error(error);
      return false;
    }
    if (records) {
      return records.map(record => new AccessParams(record));
    } else {
      return records;
    }
  },

  async giveAccessToFolder(context, accessParams) {
    try {
      var result = await api.giveAccessToFolder(accessParams);
      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async editAccessToFolder(context, accessParams) {
    try {
      return await api.editAccessToFolder(accessParams);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async removeAccessToFolder(context, accessParams) {
    try {
      return await api.removeAccessToFolder(accessParams.id);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  //#endregion

  //#region Other

  async queryUsers(context) {
    try {
      return await api.queryUsers();
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async queryGroups(context) {
    try {
      return await api.queryGroups();
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async getDeployedProcesses(context) {
    try {
      return await api.getDeployedProcesses();
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async getDeployedDecisions(context) {
    try {
      return await api.getDeployedDecisions();
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async getDeployedCases(context) {
    try {
      return await api.getDeployedCases();
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async getBusinessObjects(context, onlySystem) {
    try {
      return await api.getBusinessObjects(onlySystem);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async getBusinessObjectActions(context, { boDefCode, onlySystem }) {
    try {
      return await api.getBusinessObjectActions(boDefCode, onlySystem);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async getBusinessObjectAccess(context, { boDefCode, onlySystem }) {
    try {
      return await api.getBusinessObjectAccess(boDefCode, onlySystem);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async getBusinessObjectActionForm(context, logicalKey) {
    try {
      const result = JSON.parse(await api.getBusinessObjectActionForm(logicalKey));
      if (result.Success) {
        return result.FormioForm;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  //#endregion

  //#region Versions

  async getVersionsForDiagram(context, diagramId) {
    let result;
    try {
      result = await api.getVersionsForDiagram(diagramId);
    } catch (error) {
      console.error(error);
      return false;
    }
    if (Array.isArray(result)) {
      return result.map(item => new DiagramVersion(item));
    }
    return result;
  },

  async createDiagramVersion(context, { diagramId, versionName}) {
    try {
      return await api.createDiagramVersion(diagramId, versionName);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async getDiagramVersionXml(context, {diagramId, versionId}) {
    try {
      return await api.getDiagramVersionXml(diagramId, versionId);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async updateDiagramVersion(context, version) {
    try {
      return await api.updateDiagramVersion(version);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async deleteDiagramVersion(context, {diagramId, versionId}) {
    try {
      return await api.deleteDiagramVersion(diagramId, versionId);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async applyDiagramVersion(context, {diagramId, versionId}) {
    try {
      return await api.applyDiagramVersion(diagramId, versionId);
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async copyVersion(context, process) {
    try {
      process.xmlView = await context.dispatch('getDiagramVersionXml', {diagramId: process.diagramId, versionId: process.versionId});
      return await context.dispatch('createProcess', process);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  //#endregion

};

