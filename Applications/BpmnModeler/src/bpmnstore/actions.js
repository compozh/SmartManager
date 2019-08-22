import { BpmnModelerApi } from '../api/bpmnApi';

const api = new BpmnModelerApi();

export default {
  async setActiveModel(context, id) {
    const { model } = context.getters.getModelById(id);
    context.state.activeModel = model;
  },
  async loadModels(context) {
    let models;
    try {
      models = await api.get();
    } catch (error) {
      console.error(error);
      return false;
    }

    if (!models) {
      return false;
    }

    context.commit('setModels', models);
    return true;
  },
  async createModel(context) {
    let model;
    try {
      model = await api.create();
    } catch (error) {
      console.error(error);
    }

    if (!model) {
      return false;
    }

    model.isEditing = true;
    context.state.models.push(model);
    context.dispatch('setActiveModel', model)
    return true;
  },
  async getXml(context, id) {
    let xml;
    try {
      xml = await api.getXml(id);
    } catch (error) {
      console.error(error);
    }

    if (!xml) {
      return false;
    }

    const { model } = context.getters.getModelById(id);
    if (model) {
      model.xml === xml;
    }

    return xml;
  },
  async setXml(context, { id, xml }) {
    const { model } = context.getters.getModelById(id);
    const oldXml = model.xml;
    model.xml = xml;

    let success = false;
    try {
      success = await api.setXml(id, xml);
    } catch (error) {
      console.error(error);
    }
    
    if (!success) {
      model.xml = oldXml;
    }

    return success;
  },
  async setModelName(context, { id, name }) {
    const { model } = context.getters.getModelById(id);
    const oldName = model.name;
    model.name = name;

    let success = false;
    try {
      success = api.setName(model.id, model.name);
    } catch (error) {
      console.error(error);
    }

    if (!success) {
      model.name = oldName;
    }
    return success;
  },
  async deleteModel(context, id) {
    const { model, index } = context.getters.getModelById(id);
    if (!model) {
      return;
    }

    context.state.models = context.state.models.filter(e => e !== model);

    let success = false;

    try {
      success = await api.deleteModel(id);
    } catch (error) {
      console.error(error);
    }
    
    if (!success) {
      context.state.model.splice(index, 0, model);
    }

    return success;
  },
};
