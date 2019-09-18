import CamundaPropertiesProvider from './CamundaPropertiesProvider';
import elementTemplates from 'bpmn-js-properties-panel/lib/provider/camunda/element-templates';
import translate from 'diagram-js/lib/i18n/translate';

export default {
  __init__: ['propertiesProvider'],
  __depends__: [
    elementTemplates,
    translate
  ],
  propertiesProvider: ['type', CamundaPropertiesProvider]
};