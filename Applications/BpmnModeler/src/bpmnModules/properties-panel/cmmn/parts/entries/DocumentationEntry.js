import { PropertiesPanelEntry } from '../../../Models';
import EntryFactory from '../../CmmnEntryFactory';
import * as elementHelper from '../../helpers/CmmnElementHelper';
import * as cmdHelper from '../../helpers/CmdHelper';

/**
 * Свойство "Описание"
 */
export default class DocumentationEntry extends PropertiesPanelEntry {
  /**
   * Создать описание свойства "Описание"
   * @param {Object} options - Текущий выбранный элемент диаграммы
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Function} translate - Функция перевода
   */
  constructor(entryFactory, cmmnFactory, translate, options) {
    
    options = options || {};

    var containment = 'documentation';

    function getDocumentations(bo) {
      return bo.get(containment);
    }

    function getDocumentation(bo) {
      var documentations = getDocumentations(bo);
      return documentations.length > 0 ? documentations[0] : undefined;
    }

    const richEdit = entryFactory.richEdit({
      id: options.id || 'documentation',
      label: options.label,
      modelProperty: 'documentation',
      reference: options.reference,
      get: (element, bo) => {
        var documentation,
          text;

        if (elementHelper.isCMMNDiagram(bo)) {
          text = bo.documentation;
        } else {
          documentation = getDocumentation(bo);
          text = documentation && documentation.text;
        }
        return text;
      },
      set: (element, value, bo) => {

        var isRoot = elementHelper.isCMMNDiagram(bo),
          documentation = !isRoot && getDocumentation(bo),
          text = value || undefined,
          values = {};

        values[isRoot ? 'documentation' : 'text'] = text;

        if (isRoot) {
          return cmdHelper.updateProperties(bo, values, element);
        }

        if (documentation && !text) {
          var cmds = [];
          getDocumentations(bo).forEach((doc) => cmds.push(cmdHelper.updateSemanticParent(doc, null, containment, element)));
          return cmds;
        }

        if (!documentation && text) {
          documentation = cmmnFactory.create('cmmn:Documentation', values);
          return cmdHelper.updateSemanticParent(documentation, bo, containment, element);
        }

        return cmdHelper.updateProperties(documentation, values, element);
      }
    });

    super(richEdit.type, richEdit.data);
  }
}