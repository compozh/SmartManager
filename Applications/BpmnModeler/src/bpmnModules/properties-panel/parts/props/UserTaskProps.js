import { PropertiesPanelGroup } from '../../Models';
import EntryFactory from '../../EntryFactory';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import * as cmdHelper from '../../helpers/CmdHelper';
import { Diagram, ActionDefinitionType } from '../../../../api/models';
import { api } from '../../../../api/bpmnApi'; 
import { setServiceTaskParameters } from '../../utils';
import { eventBus } from '../../../../main';
import { events } from '../../../../constants';

/**
 * Добавить в группу свойства пользовательской задачи
 * @param {PropertiesPanelGroup} group - Группа
 * @param {Diagram} diagram - Текущая диаграмма
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
 * @param {Function} translate - Функция перевода
 */
export default function addUserTaskProps(group, diagram, element, entryFactory, bpmnFactory, commandStack, translate) {
  if (!is(element, 'IT-Enterprise:UserTask')) {
    return;
  }
  var bo = getBusinessObject(element);

  var actionDefinitionEntry = entryFactory.autocompleteBox({
    id: 'actionDefinitionId',
    label: translate('Task creation rule'),
    model: 'actionDefinitionId',
    get() {
      return bo.get('IT-Enterprise:actionDefinitionId');
    },
    set(element, value) {
      return cmdHelper.updateBusinessObject(element, bo, {
        'IT-Enterprise:actionDefinitionId': value
      });
    },
    loadItems: api.getActions(ActionDefinitionType.UserTask, diagram.isSystem),
    appendIcon: 'search',
    append() {
      const value = bo.get('IT-Enterprise:actionDefinitionId');
      eventBus.$emit(events.propertiesPanel.selectAction, value, ActionDefinitionType.UserTask, (newValue) => {
        var cmd = cmdHelper.updateBusinessObject(element, bo, {
          'IT-Enterprise:actionDefinitionId': newValue
        });
        commandStack.execute(cmd.cmd, cmd.context);
      });
    }
  });

  var setTaskPropertiesEntry = entryFactory.button({
    id: 'setExternalTaskProperties',
    label: translate('Task properties'),
    disabled() {
      var id = bo.get('IT-Enterprise:actionDefinitionId');
      return typeof id !== 'string' || id.trim() === '';
    },
    click(element) {
      var actionId = bo.get('IT-Enterprise:actionDefinitionId');
      setServiceTaskParameters(element, bo, actionId, bpmnFactory, commandStack);
    }
  })

  group.entries.push(actionDefinitionEntry, setTaskPropertiesEntry);
}