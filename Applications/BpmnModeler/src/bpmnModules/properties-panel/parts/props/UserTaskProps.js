import { PropertiesPanelGroup } from '../../Models';
import EntryFactory from '../../EntryFactory';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
import { Diagram, ActionDefinitionType } from '../../../../api/models';
import { api } from '../../../../api/bpmnApi'; 
import { setServiceTaskParameters } from '../../utils';

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

  var actionDefinitionEntry = entryFactory.autocompleteBox({
    id: 'actionDefinitionId',
    label: translate('Task creation rule'),
    model: 'actionDefinitionId',
    get(element) {
      var bo = getBusinessObject(element);
      return bo.get('IT-Enterprise:actionDefinitionId');
    },
    set(element, value) {
      var bo = getBusinessObject(element);
      return cmdHelper.updateBusinessObject(element, bo, {
        'IT-Enterprise:actionDefinitionId': value
      });
    },
    loadItems: api.getActions(ActionDefinitionType.UserTask, diagram.isSystem)
  });

  var setTaskPropertiesEntry = entryFactory.button({
    id: 'setExternalTaskProperties',
    label: translate('Task properties'),
    disabled(element) {
      var bo = getBusinessObject(element);
      var id = bo.get('IT-Enterprise:actionDefinitionId');
      return typeof id !== 'string' || id.trim() === '';
    },
    click(element) {
      var bo = getBusinessObject(element);
      var actionId = bo.get('IT-Enterprise:actionDefinitionId');
      setServiceTaskParameters(element, bo, actionId, bpmnFactory, commandStack);
    }
  })

  group.entries.push(actionDefinitionEntry, setTaskPropertiesEntry);
}