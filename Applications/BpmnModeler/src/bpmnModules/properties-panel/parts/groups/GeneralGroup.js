import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { PropertiesPanelGroup } from '../../Models';
import EntryFactory from '../../EntryFactory';
import { NameEntry } from '../entries/';
import { addProcessProps, addExecutableProps } from '../props';
import { isIdValid } from '../../utils';

/**
 * Группа "Общие" 
 */
export default class GeneralGroup extends PropertiesPanelGroup {
  /**
   * Создать группу "Общие"
   * @param {Object} element - Текущий элемент диаграммы
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Object} canvas - Полотно конструктора bpmn
   * @param {Object} bpmnFactory - Фабрика элементов bpmn
   * @param {Function} translate - Функция перевода
   */
  constructor(element, entryFactory, canvas, bpmnFactory, translate) {

    const entries = [];

    entries.push(entryFactory.textField({
      id: 'id',
      label: translate('Id'),
      model: 'id',
      validate(element, value) {
        if (!value || value.trim() === '') {
          return translate('Id can`t be empty');
        }
        var bo = getBusinessObject(element);
        var processIdError = isIdValid(bo, value, translate);
        return processIdError ? processIdError : true;
      }
    }));

    if (!is(element, 'bpmn:Collaboration')) {
      entries.push(new NameEntry(element, entryFactory, canvas, bpmnFactory, translate));
    }

    super('general', translate('General'), entries);

    addProcessProps(this, element, entryFactory, translate);
    addExecutableProps(this, element, entryFactory, translate);
  }
}

