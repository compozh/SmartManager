'use strict';

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
import { eventBus } from '../../../../main';
import { events } from '../../../../constants'; 
import ActionDefinitionType from '../../../../api/models/ActionDefinitionType';
import { setServiceTaskParameters } from '../../../properties-panel/utils'


export default function (element, bpmnFactory, options, translate, commandStack) {

  var getImplementationType = options.getImplementationType,
    getBusinessObject = options.getBusinessObject;

  function isExternal(element) {
    return getImplementationType(element) === 'external';
  }

  var topicEntry = entryFactory.textField({
    id: 'externalTopic',
    label: translate('Action'),
    modelProperty: 'externalTopic',

    buttonAction: {
      name: 'search',
      method: (element, inputNode) => {
        var bo = getBusinessObject(element);
        eventBus.$emit(events.propertiesPanel.selectAction, bo.get('camunda:topic'), ActionDefinitionType.ExternalTask, (newValue) => {
          var cmd = cmdHelper.updateBusinessObject(element, bo, {
            'camunda:topic': newValue
          });
          commandStack.execute(cmd.cmd, cmd.context);
        });
        return true;
      }
    },
    buttonShow: {
      name: 'canSearch',
      method: (element, inputNode) => true
    },

    get: function (element, node) {
      var bo = getBusinessObject(element);
      return { externalTopic: bo.get('camunda:topic') };
    },

    set: function (element, values, node) {
      var bo = getBusinessObject(element);
      return cmdHelper.updateBusinessObject(element, bo, {
        'camunda:topic': values.externalTopic
      });
    },

    validate: function (element, values, node) {
      return isExternal(element) && !values.externalTopic ? { externalTopic: translate('Must provide a value') } : {};
    },

    hidden: function (element, node) {
      return !isExternal(element);
    }

  });

  var taskProperties = entryFactory.link({
    id: 'externalTaskProperties',
    label: translate('Task properties'),
    showLink: (element, node) => {
      if (!isExternal(element)) {
        return false;
      }
      var bo = getBusinessObject(element);
      var taskCode = bo.get('camunda:topic');
      return taskCode && taskCode.trim() !== ''
    },
    handleClick: (element, node, event) => {
      var bo = getBusinessObject(element);
      var actionId = bo.get('camunda:topic');
      setServiceTaskParameters(element, bo, actionId, bpmnFactory, commandStack);
    }
  });

  return [ topicEntry, taskProperties];

}
