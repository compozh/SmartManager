import treeSearch from '../api/treeSearch';
import bpmnCompare from '../api/bpmnCompare';

export default {
  getItems(state) {
    return state.items;
  },
  getItemById: state => id => {
    let [{ item = null, index = -1 } = {}] = treeSearch(state.items, (item) => item.id === id);
    return { item, index };
  },
  getActiveItemId(state) {
    let { id = null } = state.activeItem;
    return id;
  },
  sortedItems: state => sortTree(state.items)
};

function sortTree(items) {
  if (!items) {
    return [];
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.isFolder) {
      item.items = sortTree(item.items);
    }
  }
  return items.sort(bpmnCompare);
}
