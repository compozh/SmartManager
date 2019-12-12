import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { getExtensionElements, removeEntry } from '../../helpers/ExtensionElementsHelper';
import formHelper from '../../helpers/FormHelper';
import elementHelper from '../../helpers/ElementHelper';
import * as cmdHelper from '../../helpers/CmdHelper';
import { PropertiesPanelGroup } from '../../Models';
import EntryFactory from '../../EntryFactory';

let aField;

/**
 * Группа "Простая форма"
 */
export default class SimpleFormGroup extends PropertiesPanelGroup {
  /**
   * Создать описание группы "Простая форма"
   * @param {Object} element - текущий выбранный элемент диаграммы
   * @param {EntryFactory} entryFactory - фабрика элементов панели свойств
   * @param {Object} bpmnFactory - фабрика bpmn элементов
   * @param {Function} translate  - функция перевода
   */
  constructor(element, entryFactory, bpmnFactory, translate) {
    super('simple-form', translate('Simple form'), [ entryFactory.extensionElements({
      id: 'form-fields',
      label: translate('Form Fields'),
      prefix: 'FormField',
      getExtensionElements() {
        return formHelper.getFormFields(element);
      },
      createExtensionElement: (extensionElements, id) => {
        var commands = [],
          formData = formHelper.getFormData(element);

        if (!formData) {
          formData = elementHelper.createElement('camunda:FormData', { fields: [] }, extensionElements, bpmnFactory);
          commands.push(cmdHelper.addAndRemoveElementsFromList(
            element,
            extensionElements,
            'values',
            'extensionElements',
            [formData],
            []
          ));
        }
        var field = elementHelper.createElement('camunda:FormField', { id }, formData, bpmnFactory);
        if (typeof formData.fields !== 'undefined') {
          commands.push(cmdHelper.addElementsTolist(element, formData, 'fields', [field]));
        } else {
          commands.push(cmdHelper.updateBusinessObject(element, formData, {
            fields: [field]
          }));
        }
        return commands;
      },
      removeExtensionElement: (field) => {
        var formData = getExtensionElements(getBusinessObject(element), 'camunda:FormData')[0],
          entry = field,
          commands = [];

        if (formData.fields.length < 2) {
          commands.push(removeEntry(getBusinessObject(element), element, formData));
        } else {
          commands.push(cmdHelper.removeElementsFromList(element, formData, 'fields', null, [entry]));

          if (entry.id === formData.get('businessKey')) {
            commands.push(cmdHelper.updateBusinessObject(element, formData, { 'businessKey': undefined }));
          }
        }
        return commands;
      },
      onActiveElementChanged: (fieldId) => {
        this.activeField = aField = formHelper.getFormFieldById(element, fieldId);
      }
    })]);
    this.entryFactory = entryFactory;
    this.translate = translate;
  }

  activeField = aField

  get entries() {
    const entries = [],
      entryFactory = this.entryFactory,
      translate = this.translate;

    const activeField = this.activeField || aField || { },
      fieldPropsVisible = aField != null;
    
    entries.push(entryFactory.label({
      id: 'form-field-header',
      value: translate('Form Field'),
      visible: fieldPropsVisible
    }));
    
    entries.push(entryFactory.textField({
      id: 'form-field-id',
      label: translate('ID'),
      model: 'id',
      get: () => activeField.id,
      set: (element, id) => cmdHelper.updateBusinessObject(element, activeField, { id }),
      validate: (element, id) => {
        if (!id || id.trim() === '') {
          return translate('Form field id must not be empty');
        }

        var formFields = formHelper.getFormFields(element);

        var existingFormField = find(formFields, function (f) {
          return f !== activeField && f.id === id;
        });

        if (existingFormField) {
          return translate('Form field id already used in form data');
        }

        return true;
      },
      visible: fieldPropsVisible
    }));

    entries.push(entryFactory.textField({
      id: 'form-field-label',
      label: translate('Label'),
      model: 'label',
      get: () => activeField.label,
      set: (element, label) => cmdHelper.updateBusinessObject(element, activeField, { label }),
      visible: fieldPropsVisible
    }));

    entries.push(entryFactory.selectBox({
      id: 'form-field-type',
      label: translate('Type'),
      model: 'type',
      items: [
        { name: translate('string'), value: 'string' },
        { name: translate('long'), value: 'long' },
        { name: translate('boolean'), value: 'boolean' },
        { name: translate('date'), value: 'date' },
        // TODO: добавить поддержку настройки перечислений
        //{ name: translate('enum'), value: 'enum' }
      ],
      get: () => activeField.type,
      set: (element, type) => cmdHelper.updateBusinessObject(element, activeField, {
        type,
        defaultValue: undefined
      }),
      visible: fieldPropsVisible
    }));

    switch (activeField.type) {
    case 'boolean':
      entries.push(entryFactory.checkbox({
        id: 'form-field-defaultValue',
        label: `${translate('Default Value')}: ${activeField.defaultValue === true}`,
        model: 'defaultValue',
        get: () => activeField.defaultValue === true,
        set: (element, defaultValue) => cmdHelper.updateBusinessObject(element, activeField, { defaultValue }),
        visible: fieldPropsVisible,
      }));
      break;
    case 'date':
      entries.push(entryFactory.datePicker({
        id: 'form-field-defaultValue',
        label: translate('Default Value'),
        model: 'defaultValue',
        get: () => activeField.defaultValue,
        set: (element, defaultValue) => cmdHelper.updateBusinessObject(element, activeField, { defaultValue }),
        visible: fieldPropsVisible,
      }));
      break;
    default:
      entries.push(entryFactory.textField({
        id: 'form-field-defaultValue',
        label: translate('Default Value'),
        model: 'defaultValue',
        get: () => activeField.defaultValue,
        set: (element, defaultValue) => cmdHelper.updateBusinessObject(element, activeField, { defaultValue }),
        visible: fieldPropsVisible,
        type: activeField.type === 'long' ? 'number' : 'text'
      }));
      break;
    }

    return this._entries.concat(entries);
  }
}