import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import participantHelper from '../../helpers/ParticipantHelper';
import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../../EntryFactory';

/**
 * Добавить в группу свойства исполняемости
 * @param {PropertiesPanelGroup} group - Группа
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
 * @param {Function} translate - Функция перевода
 */
export default function addExecutableProps(group, element, entryFactory, translate) {
  var bo = getBusinessObject(element);

  if (!bo) {
    return;
  }

  if (is(element, 'bpmn:Process') || (is(element, 'bpmn:Participant') && bo.get('processRef'))) {

    const options = {
      id: 'process-is-executable',
      label: translate('Executable'),
      model: 'isExecutable'
    };

    // для Пулов/Участников нужно изменить стандартнные функции
    if (is(element, 'bpmn:Participant')) {
      options.get = function (element) {
        return participantHelper.getProcessBusinessObject(element, 'isExecutable').isExecutable;
      };

      options.set = function (element, value) {
        return participantHelper.modifyProcessBusinessObject(element, 'isExecutable', { isExecutable: value });
      };
    }

    group.entries.push(entryFactory.checkbox(options));
  }
}