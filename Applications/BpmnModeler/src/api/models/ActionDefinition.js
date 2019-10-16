import ActionDefinitionType from './ActionDefinitionType';

export default class ActionDefinition {
  constructor({ id, name = '', type = ActionDefinitionType.ExternalTask, unformio, isSystem = false } = {}) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.unformio = unformio;
    this.isSystem = isSystem;
  }
}