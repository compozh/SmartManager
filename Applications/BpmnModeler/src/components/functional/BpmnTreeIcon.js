import Folder from '../../api/models/Folder';
import DiagramType from '../../api/models/DiagramType';
import Diagram from '../../api/models/Diagram';

export default {
  name: 'bpmn-tree-icon',
  functional: true,
  props: {
    node: {
      required: true,
      type: Object
    }
  },
  render(createElement, { props }) {
    const item = props.node.data;
    if (item instanceof Folder) {
      if (props.node.expanded) {
        return createElement('v-icon', 'mdi-folder-open');
      } else {
        return createElement('v-icon', 'mdi-folder');
      }
    } else if (item instanceof Diagram) {
      switch (item.type) {
      case DiagramType.BPMN:
        return createElement('v-icon', 'mdi-file-tree');
      case DiagramType.DMN:
        return createElement('v-icon', 'mdi-table');
      }
    }
    return createElement('v-icon');
  }
}