export default {
  getModels(state) {
    return state.models;
  },
  getModelById: state => id => {
    for (let index = 0; index < state.models.length; index++) {
      const model = state.models[index];
      if (model.id === id) {
        return { model, index }
      }
    }
    return { model: null, index: -1 };
  },
};
