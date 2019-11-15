import { PropertiesPanelTab } from '../../bpmnModules/properties-panel/Models';
import PropertiesPanelGroup from './PropertiesPanelGroup';

export default {
  name: 'properties-panel-tab',
  functional: true,
  components: { PropertiesPanelGroup },
  props: {
    tab: {
      type: PropertiesPanelTab,
      required: true
    }
  },
  render(createElement, { props }) {
    const tab = props.tab;
    return createElement('el-collapse', { props: { key: tab.key, value: tab.groups.map(group => group.key) } }, tab.groups.map(group => {
      return createElement('properties-panel-group', { props: { group } });
    }));
  }
}