import { getBusinessObject } from 'cmmn-js/lib/util/ModelUtil';
import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../../EntryFactory';
import { addNameProps, addCaseProps, addIdProps } from '../props';
import { isIdValid } from '../../../utils';
import * as elementHelper from '../../helpers/CmmnElementHelper';

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
    super('general', translate('General'), []);

    addCaseProps(this, element, entryFactory, translate);
    addIdProps(this, element, entryFactory, translate);
    addNameProps(this, element, entryFactory, translate);
  }
}

