export default {
  setItems(state, items) {
    if (!items) {
      items = [];
    }
    state.items = items;
  }
};
