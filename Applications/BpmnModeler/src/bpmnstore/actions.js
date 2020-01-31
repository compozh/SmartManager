/* eslint-disable require-atomic-updates */
import { api } from '../api/bpmnApi';
import { Folder, Diagram, Configuration, ActionDefinition, DiagramAccess } from '../api/models';

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
  async loadItems(context) {
    let items;
    try {
      items = await api.getItems()
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
    const folderExisit = context.state.items.findIndex(item => item instanceof Folder) >= 0;
    if (folderExisit) {
      return;
    }
    await context.dispatch('createFolder', new Folder({ name: context.rootState.auth.user.userName }))
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
    if(newDiagram) {
      await context.dispatch('resetCache');
      await context.dispatch('loadItems');
    }
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
    return items.map(action => new ActionDefinition(action));
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
    
    await context.dispatch('resetCache');
    await context.dispatch('loadItems');
  
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
    debugger
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
    if(success) {
      await context.dispatch('resetCache')
      await context.dispatch('loadItems')
    }
    return success;
  },
  async itemDropped(context, { draggingItem, dropItem, type }) {
    switch (type) {
    case 'before':
    case 'after':
      draggingItem.parentId = dropItem.parentId;
      break;
    case 'inner':
      draggingItem.parentId = dropItem.id;
      break;
    }
    let success = false;
    try {
      if (draggingItem.isFolder) {
        success = await api.moveFolder(draggingItem.id, draggingItem.parentId);
      } else {
        success = await api.moveDiagram(draggingItem.id, draggingItem.parentId);
      }
    } catch (error) {
      console.error(error);
    }
    await context.dispatch('resetCache');
    await context.dispatch('loadItems');
    return success;
  },

  //#endregion

  //#region Access

  async getAccessRecordsForProcess(context, diagramId) {
    let records;
    try {
      records = await api.getAccessRecordsForDiagram(diagramId);
    } catch (error) {
      console.error(error);
      return false;
    }
    return records.map(record => new DiagramAccess(record));
  },

  async giveAccessToProcess(context, accessParams) {
    try {
      var result = await api.giveAccessToDiagram(accessParams);
      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async editAccessToProcess(context, accessParams) {
    try {
      return await api.editAccessToDiagram(accessParams);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async removeAccessToProcess(context, accessParams) {
    try {
      return await api.removeAccessToDiagram(accessParams);
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
  }

  //#endregion

};

