'use strict';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { ImplementationTypeHelper } from '../../../ImplementationTypeHelper'

import callable from 'bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/Callable';
import implementationType from '../implementation/ImplementationType';
import externalTaskProperties from '../implementation/ExternalTaskProperties';
import resultVariable from 'bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/ResultVariable';


function getImplementationType(element) {
  return ImplementationTypeHelper.getImplementationType(element);
}

function getBusinessObject(element) {
  return ImplementationTypeHelper.getServiceTaskLikeBusinessObject(element);
}

function isDmnCapable(element) {
  return ImplementationTypeHelper.isDmnCapable(element);
}

function isExternalCapable(element) {
  return ImplementationTypeHelper.isExternalCapable(element);
}

function isServiceTaskLike(element) {
  return ImplementationTypeHelper.isServiceTaskLike(element);
}

export default function (group, element, bpmnFactory, translate, commandStack) {

  if (!isServiceTaskLike(getBusinessObject(element))) {
    return;
  }

  var hasDmnSupport = isDmnCapable(element);
  var hasExternalSupport = isExternalCapable(getBusinessObject(element));

  // implementation type ////////////////////////////////////

  if (!is(element, 'IT-Enterprise:ServiceTaskLike')) {
    group.entries = group.entries.concat(implementationType(element, bpmnFactory, {
      getBusinessObject: getBusinessObject,
      getImplementationType: getImplementationType,
      hasDmnSupport: hasDmnSupport,
      hasExternalSupport: hasExternalSupport,
      hasServiceTaskLikeSupport: true
    }, translate));
  }

  // result variable /////////////////////////////////////////

  group.entries = group.entries.concat(resultVariable(element, bpmnFactory, {
    getBusinessObject: getBusinessObject,
    getImplementationType: getImplementationType,
    hideResultVariable: function (element, node) {
      return getImplementationType(element) !== 'expression';
    }
  }, translate));

  // external //////////////////////////////////////////////////

  if (hasExternalSupport) {
    group.entries = group.entries.concat(externalTaskProperties(element, bpmnFactory, {
      getBusinessObject: getBusinessObject,
      getImplementationType: getImplementationType
    }, translate, commandStack));
  }


  // dmn ////////////////////////////////////////////////////////

  if (hasDmnSupport) {
    group.entries = group.entries.concat(callable(element, bpmnFactory, {
      getCallableType: getImplementationType
    }, translate));
  }

}
