import AccessType from './AccessType';
import AccessRights from './AccessRights';

export default class AccessParams {
  constructor({ id, recordId, userId = '', userName = '', groupId = '', groupName = '', type = AccessType.All, parentId,
    read = false, write = false, deploy = false, execute = false, share = false, inherit } = {}) {
    
    this.id = id;
    this.recordId = recordId;
    this.userId = userId;
    this.userName = userName;
    this.groupId = groupId;
    this.groupName = groupName;
    this.type = type;
    this.parentId = parentId;
    this.read = read;
    this.write = write;
    this.deploy = deploy;
    this.execute = execute;
    this.share = share;
    this.inherit = typeof inherit === 'boolean' ? inherit : true;
  }

  hasRight(right) {
    return this.rights.includes(right);
  }
  get identity() {
    return typeof this.userId === 'string' && this.userId.trim() !== '' ? this.userId :
      typeof this.groupId === 'string' && this.groupId.trim() !== '' ? this.groupId :
        '';
  }
  get rights() {
    const rights = [];

    if (this.read) { rights.push(AccessRights.Read); }
    if (this.write) { rights.push(AccessRights.Write); }
    if (this.deploy) { rights.push(AccessRights.Deploy); }
    if (this.execute) { rights.push(AccessRights.Execute); }
    if (this.share) { rights.push(AccessRights.Share); }

    return rights;
  }
  set rights(value) {
    if (!Array.isArray(value)) {
      return;
    }
    this.read = this.write = this.deploy = this.execute = this.share = false;

    value.forEach(right => {
      switch (right) {
      case AccessRights.Read:
        this.read = true
        break;
      case AccessRights.Write:
        this.write = true
        break;
      case AccessRights.Deploy:
        this.deploy = true
        break;
      case AccessRights.Execute:
        this.execute = true
        break;
      case AccessRights.Share:
        this.share = true
        break;
      }
    });

  }
}