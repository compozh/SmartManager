import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../../EntryFactory';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { api } from '../../../../../api/bpmnApi';
import * as cmdHelper from '../../helpers/CmdHelper';
import { eventBus } from '../../../../../main';
import { events } from '../../../../../constants';

/**
 * 
 * @param {PropertiesPanelGroup} group 
 * @param {Object} element 
 * @param {EntryFactory} entryFactory 
 * @param {object} bpmnFactory 
 * @param {Function} translate 
 */
export default function addBusinessRuleProps(group, element, entryFactory, commandStack, translate) {
  if (!is(element, 'bpmn:BusinessRuleTask')) {
    return;
  }
  const required = (element, value) => { if (typeof value !== 'string' || value === '') { return translate('Must provide a value'); } return true; };
  const bo = getBusinessObject(element);
  const decisionRef = bo.get('decisionRef');

  group.entries.push(entryFactory.autocompleteBox({
    id: 'callable-element',
    label: translate('Decision Ref'),
    model: 'camunda:decisionRef',
    loadItems: (async () => (await api.getDeployedDecisions())
      .map(decision => { return { id: decision.decDefKey, name: decision.decDefName }; })
      .filter((decision, index, self) => self.indexOf(decision) === index))(),
    set: (element, value) => {
      if (!value) {
        return cmdHelper.updateBusinessObject(element, bo, {
          'camunda:decisionRef': undefined,
          'camunda:decisionRefBinding': undefined,
          'camunda:decisionRefVersion': undefined
        });
      }
      return cmdHelper.updateBusinessObject(element, bo, {
        'camunda:decisionRef': value
      });
    },
    validate: required,
    appendIcon: 'mdi-magnify',
    append: () => {
      eventBus.$emit(events.propertiesPanel.selectDeployedDecision, decisionRef, (decDefKey) => {
        const cmd = cmdHelper.updateBusinessObject(element, bo, { 'camunda:decisionRef': decDefKey });
        commandStack.execute(cmd.cmd, cmd.context);
      });
    }
  }));

  if (typeof decisionRef === 'string' && decisionRef !== '') {
    group.entries.push(entryFactory.selectBox({
      id: 'calledElementBinding',
      label: translate('Binding'),
      model: 'camunda:decisionRefBinding',
      items: [{ value: 'latest', name: translate('Latest') }, { value: 'version', name: translate('Version') }],
      get: () => {
        const value = bo.get('camunda:decisionRefBinding');
        if (value === 'version') {
          return value;
        }
        return 'latest';
      },
      set: (element, value) => {
        if (value === 'version') {
          return cmdHelper.updateBusinessObject(element, bo, { 'camunda:decisionRefBinding': value, 'camunda:decisionRefVersion': undefined });
        }
        return cmdHelper.updateBusinessObject(element, bo, { 'camunda:decisionRefBinding': undefined, 'camunda:decisionRefVersion': undefined });
      },
      validate: required
    }));

    const binding = bo.get('camunda:decisionRefBinding');
    if (binding === 'version') {
      group.entries.push(entryFactory.autocompleteBox({
        id: 'version',
        label: translate('Version'),
        model: 'camunda:decisionRefVersion',
        loadItems: (async () => (await api.getDeployedDecisions())
          .filter(decision => decision.decDefKey === decisionRef)
          .map(decison => { return { id: decison.decDefVer.toString(), name: decison.decDefVer }; }))(),
        set: (element, value) => {
          if (!value) {
            return cmdHelper.updateBusinessObject(element, bo, { 'camunda:decisionRefVersion': undefined });
          }
          return cmdHelper.updateBusinessObject(element, bo, { 'camunda:decisionRefVersion': value });
        },
        validate: required
      }));
    }
  }
}