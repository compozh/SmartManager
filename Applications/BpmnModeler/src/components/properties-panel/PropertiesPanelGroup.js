import { PropertiesPanelGroup } from '../../bpmnModules/properties-panel/Models';

export default {
  name: 'properties-panel-group',
  functional: true,
  props: {
    group: {
      type: PropertiesPanelGroup,
      required: true
    }
  },
  render(createElement, { props }) {
    const group = props.group;
    return createElement('el-collapse-item', { props: { name: group.key, title: group.title } }, group.entries.map(entry => {
      return createElement(entry.type, { ...entry.data }, entry.children(createElement));
    }));
  }
}