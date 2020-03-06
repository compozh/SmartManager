import { PropertiesPanelEntry } from '../../../Models';
import EntryFactory from '../../CmmnEntryFactory';
import * as cmdHelper from '../../helpers/CmdHelper';

const noop = function () { };
const noopEmptyList = function () { return []; };

/**
 * Свойство "Описание"
 */
export default class DocumentationEntry extends PropertiesPanelEntry {
  /**
   * Создать описание свойства "Описание"
   * @param {Object} options - Текущий выбранный элемент диаграммы
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Object} cmmnFactory
   * @param {Function} translate - Функция перевода
   */
  constructor(entryFactory, cmmnFactory, translate, options) {

    options = options || {};

    var id = options.id,
      label = options.label,
      reference = options.reference,
      model = options.model || 'body',
      getCondition = options.getCondition || noop,
      createdCondition = options.createdCondition || noopEmptyList,
      removedCondition = options.removedCondition || noopEmptyList;


    const conditionEntry = entryFactory.textField({
      id: id || 'condition',
      label: label || translate('Condition'),
      model: model,
      reference: reference,
      get: (element, bo) => {
        const condition = getCondition(element, bo);
        return (condition && condition.get('body')) || undefined;
      },
      set: (element, value, bo) => {

        var condition = getCondition(element, bo),
          body = value || undefined,
          values = { body: body },
          cmds = [];

        if (body) {

          if (!condition) {
            condition = cmmnFactory.create('cmmn:Expression', values);
            cmds.push(...createdCondition(condition, element, bo));
          } else {
            cmds.push(cmdHelper.updateProperties(condition, values, element));
          }
        } else {
          if (condition) {
            cmds.push(
              cmdHelper.updateProperties(condition, values, element),
              cmdHelper.updateSemanticParent(condition, null, null, element),
              ...removedCondition(condition, element, bo)
            );
          }
        }
        return cmds;
      },
      validate: options.validate,
    });

    super(conditionEntry.type, conditionEntry.data);
  }
}