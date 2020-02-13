import EntryFactoryBase from '../EntryFactory';
import { getBusinessObject } from 'cmmn-js/lib/util/ModelUtil';
import * as cmdHelper from './helpers/CmdHelper';

export default class CmmnEntryFactory extends EntryFactoryBase {
  get(options) {
    const bo = getReferencedObject(this.element, options.reference);

    if (options.get) {
      return options.get(this.element, bo);
    } else {
      return bo.get(options.model);
    }
  }

  set(options, value) {
    if (this.readonly || this.validate(options, value) !== true) {
      return;
    }
    const bo = getReferencedObject(this.element, options.reference);
    let command;
    if (options.set) {
      command = options.set(this.element, value, bo);
    } else {
      command = cmdHelper.updateProperties(bo, { [options.model]: value }, this.element);
    }
    this.execute(command);
  }
}

function getReferencedObject(element, reference) {
  var bo = getBusinessObject(element);

  if (reference) {
    return bo && bo.get(reference);
  }

  return bo;
}