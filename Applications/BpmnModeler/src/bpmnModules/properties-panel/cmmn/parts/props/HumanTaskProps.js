import { getDefinition } from 'cmmn-js/lib/util/ModelUtil';
import * as cmdHelper from '../../helpers/CmdHelper';
import { isFormSupported, isHumanTask } from '../../helpers/CmmnElementHelper';
import EntryFactory from '../../CmmnEntryFactory';
import { api } from '../../../../../api/bpmnApi';
import { eventBus } from '../../../../../main';
import { events } from '../../../../../constants';
import { Diagram, ActionDefinitionType } from '../../../../../api/models';
import { setServiceTaskParameters } from '../../utils';

/**
 * Добавить в группу свойства наименования
 * @param {PropertiesPanelGroup} group - Группа
 * @param {Diagram} diagram - Текущая диаграмма
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
 * @param {Function} translate - Функция перевода
 */
export default function CaseProps(group, diagram, element, entryFactory, cmmnFactory, commandStack, translate) {

  const bo = getDefinition(element);

  if (isFormSupported(element)) {
    const options = {
      id: 'form-key',
      label: translate('Form Key'),
      model: 'camunda:formKey',
      reference: 'definitionRef',
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

    group.entries.push(entryFactory.autocompleteBox(options));
  }

  if (isHumanTask(element)) {
    var actionDefinitionEntry = entryFactory.autocompleteBox({
      id: 'actionDefinitionId',
      label: translate('Task creation rule'),
      model: 'IT-Enterprise:actionDefinitionId',
      reference: 'definitionRef',
      loadItems: api.getActions(ActionDefinitionType.UserTask, diagram.isSystem),
      appendIcon: 'mdi-magnify',
      append() {
        const value = bo.get('IT-Enterprise:actionDefinitionId');
        eventBus.$emit(events.propertiesPanel.selectAction, value, ActionDefinitionType.UserTask, (newValue) => {
          var cmd = cmdHelper.updateBusinessObject(element, bo, {
            'IT-Enterprise:actionDefinitionId': newValue
          });
          commandStack.execute(cmd.cmd, cmd.context);
        });
      }
    });

    var setTaskPropertiesEntry = entryFactory.button({
      id: 'setExternalTaskProperties',
      label: translate('Task properties'),
      disabled() {
        var id = bo.get('IT-Enterprise:actionDefinitionId');
        return typeof id !== 'string' || id.trim() === '';
      },
      click(element) {
        var actionId = bo.get('IT-Enterprise:actionDefinitionId');
        setServiceTaskParameters(element, bo, actionId, cmmnFactory, commandStack);
      }
    });

    group.entries.push(actionDefinitionEntry, setTaskPropertiesEntry);
  }
}