import { BpmnModelerApi } from '../api/bpmnApi';
import Folder from '../api/models/Folder';
import Process from '../api/models/Process';

const api = new BpmnModelerApi();

export default {
  async setActiveItem(context, item) {
    if (typeof item === 'string' || item instanceof String) {
      ({ item } = context.getters.getItemById(item));
    }
    context.state.activeItem = item;
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
        return new Process(e);
      }
    });
    items = mapTree(items);
    context.commit('setItems', items);
    return true;
  },
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
  async createProcess(context, process) {
    let newProcess;
    try {
      newProcess = await api.createProcess(process);
    } catch (error) {
      console.error(error);
      return false;
    }
    if (!newProcess) {
      return false;
    }
    Object.assign(process, newProcess);
    await context.dispatch('loadItems');
    return true;
  },
  async editProcess(context, { id, name }) {
    const { item: process } = context.getters.getItemById(id);
    const oldName = process.name;
    process.name = name;

    let success = false;
    try {
      success = await api.editProcess(process);
    } catch (error) {
      console.error(error);
    }
    if (!success) {
      process.name = oldName;
    }
    return success;
  },
  async createFolder(context, folder) {
    let newFolder;
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
        success = await api.deleteProcess(id);
      }
    } catch (error) {
      console.error(error);
    }
    await context.dispatch('loadItems');
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
        success = await api.dropFolder(draggingItem.id, draggingItem.parentId);
      } else {
        success = await api.dropProcess(draggingItem.id, draggingItem.parentId);
      }
    } catch (error) {
      console.error(error);
    }
    await context.dispatch('loadItems');
    return success;
  },
  async deployProcess(context, id) {
    let result;
    try {
      result = await api.deployProcess(id);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    if (!result.success) {
      console.log(result);
    }
    return result;
  }
};

