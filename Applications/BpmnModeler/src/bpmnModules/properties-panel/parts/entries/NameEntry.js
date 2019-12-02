import { PropertiesPanelEntry } from '../../Models';
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { createCategoryValue } from '../../helpers/CategoryHelper';
import EntryFactory from '../../EntryFactory';

/**
 * Свойство "Название элемента"
 */
export default class NameEntry extends PropertiesPanelEntry {
  /**
   * Создать описание свойства "Название элемента"
   * @param {Object} element - Текущий выбранный элемент диаграммы
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Object} canvas - Полотно конструктора bpmn
   * @param {Object} bpmnFactory - Фабрика bpmn элементов
   * @param {Function} translate - Функция перевода
   */
  constructor(element, entryFactory, canvas, bpmnFactory, translate) {

    function initializeCategory(semantic) {
      var rootElement = canvas.getRootElement(),
        definitions = getBusinessObject(rootElement).$parent,
        categoryValue = createCategoryValue(definitions, bpmnFactory);

      semantic.categoryValueRef = categoryValue;
    }

    function setGroupName(element, value) {
      var bo = getBusinessObject(element),
        categoryValueRef = bo.categoryValueRef;

      if (!categoryValueRef) {
        initializeCategory(bo);
      }
      
      return {
        cmd: 'element.updateLabel',
        context: {
          element: element,
          newLabel: value
        }
      };
    }

    function getGroupName(element) {
      var bo = getBusinessObject(element),
        value = (bo.categoryValueRef || {}).value;

      return value;
    }

    var options = {};

    if (is(element, 'bpmn:TextAnnotation')) {
      options = {
        label: translate('Text'),
        model: 'text'
      }
    } else if (is(element, 'bpmn:Group')) {
      options = {
        label: translate('Category Value'),
        model: 'categoryValue',
        get: getGroupName,
        set: setGroupName
      };
    }    

    var textArea = entryFactory.textArea({
      id: options.id || 'name',
      label: options.label || translate('Name'),
      model: options.model || 'name',
      get: options.get,
      set: options.set
    });

    super(textArea.type, textArea.data);
  }
}