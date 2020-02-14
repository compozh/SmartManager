import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../../EntryFactory';
import * as cmdHelper from '../../helpers/CmdHelper';
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';

/**
 * Группа "Документация"
 */
export default class DocumentationGroup extends PropertiesPanelGroup {
  /**
   * Создать группу "Документация"
   * @param {Object} element - Текущий выбранный элемент диаграммы
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Function} translate - Функция перевода
   */
  constructor(element, entryFactory, bpmnFactory, translate) {
    const entries = [];

    function getValue(bo) {
      return function () {
        var documentations = bo && bo.get('documentation'),
          text = (documentations && documentations.length > 0) ? documentations[0].text : '';

        return text;
      };
    }

    function setValue(bo) {
      return function (element, value) {
        var newObjectList = [];

        if (typeof value !== 'undefined' && value !== '') {
          newObjectList.push(bpmnFactory.create('bpmn:Documentation', {
            text: value
          }));
        }

        return cmdHelper.setList(element, bo, 'documentation', newObjectList);
      };
    }

    var bo = getBusinessObject(element);

    entries.push(entryFactory.richEdit({
      id: 'documentation',
      model: 'documentation',
      get: getValue(bo),
      set: setValue(bo)
    }));

    // Документация для процесса, если диаграмма коллаборации
    if (is(element, 'bpmn:Participant')) {

      var processRef = getBusinessObject(element).processRef;

      // не отображать для свёрнутых Пулов/Учасников
      if (processRef) {

        entries.push(entryFactory.richEdit({
          id: 'process-documentation',
          label: translate('Process Documentation'),
          model: 'documentation',
          get: getValue(processRef),
          set: setValue(processRef)
        }));
      }
    }

    super('documentation', translate('Item description'), entries);
  }
}