export default {
  setModels(state, models) {
    if (!models) {
      models = [];
    }
    state.models = models;
  }
};
