import AccessType from './AccessType';
import DiagramAccessRights from './DiagramAccessRights';

export default class DiagramAccess {
  constructor({ recordId, userId = '', groupId = '', allowAccess = true, type = AccessType.All, rights = [ ] } = {}) {
    this.recordId = recordId;
    this.userId = userId;
    this.groupId = groupId;
    this.allowAccess = allowAccess;
    this.type = type;
    this.rights = rights;
  }

  hasRight(right) {
    return this.rights.includes(right);
  }

  get id() {
    return this.recordId + this.userId + this.groupId + this.allowAccess;
  }
}