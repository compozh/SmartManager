import inherits from 'inherits';
import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { is } from 'bpmn-js/lib/util/ModelUtil';

export default function BpmnRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(BpmnRules, RuleProvider);

BpmnRules.$inject = ['eventBus'];

BpmnRules.prototype.init = function () {
  this.addRule('shape.resize', 2000, function (context) {

    var shape = context.shape;
    
    if (is(shape, 'bpmn:Task') || is(shape, 'bpmn:CallActivity')) {
      return true;
    }
  });
};