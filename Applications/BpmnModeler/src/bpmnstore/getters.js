import treeSearch from '../api/treeSearch';

export default {
  getItems(state) {
    return state.items;
  },
  getItemById: state => id => {
    let [{ item = null, index = -1 } = {}] = treeSearch(state.items, (item) => item.id === id);
    return { item, index };
  },
  getActiveItemId(state) {
    if (state.activeItem) {
      return state.activeItem.id;
    }
    return null;
  }
};
