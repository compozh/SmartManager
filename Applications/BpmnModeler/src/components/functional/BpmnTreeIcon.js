import Folder from '../../api/models/Folder';
import ProcessType from '../../api/models/ProcessType';
import Process from '../../api/models/Process';

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
    } else if (item instanceof Process) {
      switch (item.type) {
      case ProcessType.BPMN:
        return createElement('v-icon', 'mdi-file-tree');
      case ProcessType.DMN:
        return createElement('v-icon', 'mdi-table');
      }
    }
    return createElement('v-icon');
  }
}