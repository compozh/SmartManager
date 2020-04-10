import ActionCategory from './ActionCategory';

export default class ActionDefinition {
  constructor({ code, name = '', formCode, isSystem = false, categories = [] } = {}) {
    this.id = code;
    this.name = name;
    this.formCode = formCode;
    this.isSystem = isSystem;
    if (Array.isArray(categories)) {
      this.categories = categories.map(c => new ActionCategory(c));
    }
  }
}
