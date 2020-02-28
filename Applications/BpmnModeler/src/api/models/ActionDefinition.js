import ActionDefinitionType from './ActionDefinitionType';

export default class ActionDefinition {
  constructor({ code, name = '', type = ActionDefinitionType.ExternalTask, unformio, isSystem = false } = {}) {
    this.id = code;
    this.name = name;
    this.type = type;
    this.unformio = unformio;
    this.isSystem = isSystem;
  }
}
