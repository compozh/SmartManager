import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import participantHelper from 'bpmn-js-properties-panel/lib/helper/ParticipantHelper';
import utils from 'bpmn-js-properties-panel/lib/Utils';
import { PropertiesPanelGroup } from '../../Models';

/**
 * Добавить в группу свойства процесса
 * @param {PropertiesPanelGroup} group - Группа
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
 * @param {Function} translate - Функция перевода
 */
export default function addProcessProps(group, element, entryFactory, translate) {
  const businessObject = getBusinessObject(element);

  if (is(element, 'bpmn:Process') || (is(element, 'bpmn:Participant') && businessObject.get('processRef'))) {

    if (is(element, 'bpmn:Participant')) {
      var idEntry = entryFactory.textField({
        id: 'process-id',
        label: translate('Process Id'),
        modelProperty: 'processId',
        get(element) {
          const properties = participantHelper.getProcessBusinessObject(element, 'id');
          return properties.id;
        },
        set(element, value) {
          return participantHelper.modifyProcessBusinessObject(element, 'id', { id: value });
        },
        validate(element, value) {
          if (!value || value.trim() === '') {
            return translate('Id can`t be empty');
          }
          var bo = getBusinessObject(element);
          var processIdError = utils.isIdValid(bo.processRef, value, translate);
          return processIdError ? processIdError : true;
        }
      });
      group.entries.push(idEntry);

      var processNameEntry = entryFactory.textArea({
        id: 'process-name',
        label: translate('Process Name'),
        get(element) {
          const properties = participantHelper.getProcessBusinessObject(element, 'name');
          return properties.name;
        },
        set(element, value) {
          return participantHelper.modifyProcessBusinessObject(element, 'name', { name: value });
        }
      });
      group.entries.push(processNameEntry);
    }
  }
}

