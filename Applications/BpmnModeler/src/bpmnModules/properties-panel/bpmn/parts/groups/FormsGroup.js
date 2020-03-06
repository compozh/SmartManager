import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../../EntryFactory';
import { api } from '../../../../../api/bpmnApi';
import { eventBus } from '../../../../../main';
import { events } from '../../../../../constants';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import * as cmdHelper from '../../helpers/CmdHelper';
import { Diagram } from '../../../../../api/models';

/**
 * Группа "Форма"
 */
export default class FormsGroup extends PropertiesPanelGroup {
  /**
   * Создать группу "Форма"
   * @param {Diagram} diagram - Текущая диаграммы
   * @param {Object} element - Текущий выбранный элемент диаграммы
   * @param {EntryFactory} entryFactory - Фабрика элементов bpmn
   * @param {Function} translate - Функция перевода
   */
  constructor(diagram, element, entryFactory, commandStack, translate) {
    var bo = getBusinessObject(element);

    const options = {
      id: 'form-key',
      label: translate('Form Key'),
      model: 'formKey',
      loadItems: api.getForms(diagram.isSystem)
    };

    const formKey = bo.get('camunda:formKey');
    if (typeof formKey !== 'string' || formKey.trim() === '') {
      options.prependIcon = 'mdi-plus';
      options.prepend = () => {
        eventBus.$emit(events.formio.createForm, (formKey, name) => {
          api.addForm(formKey, name);
          var cmd = cmdHelper.updateBusinessObject(element, bo, {
            'camunda:formKey': formKey
          });
          commandStack.execute(cmd.cmd, cmd.context);
        }, diagram.isSystem);
      };
    } else {
      options.prependIcon = 'mdi-pencil';
      options.prepend = () => {
        eventBus.$emit(events.formio.editForm, formKey);
      };
    }

    super('forms', translate('Forms'), [
      entryFactory.autocompleteBox(options)
    ]);
  }
}