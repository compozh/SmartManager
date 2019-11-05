import AccessType from './AccessType';

export default class DiagramAccess {
  constructor({ recordId, userId = '', userName = '', groupId = '', groupName = '', allowAccess = true, type = AccessType.All, rights = [ ] } = {}) {
    this.recordId = recordId;
    this.userId = userId;
    this.userName = userName;
    this.groupId = groupId;
    this.groupName = groupName;
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