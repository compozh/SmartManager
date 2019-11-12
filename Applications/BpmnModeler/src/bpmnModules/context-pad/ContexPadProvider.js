import BaseContexPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';
import { inherits } from 'util';
import { assign } from 'min-dash';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

export default function ContextPadProvider(
  config, injector, eventBus,
  contextPad, modeling, elementFactory,
  connect, create, popupMenu,
  canvas, rules, translate) {
  
  BaseContexPadProvider.call(this,
    config, injector, eventBus,
    contextPad, modeling, elementFactory,
    connect, create, popupMenu,
    canvas, rules, translate);
}

inherits(ContextPadProvider, BaseContexPadProvider);

ContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate'
];

ContextPadProvider.prototype.getContextPadEntries = function (element) {
  var actions = BaseContexPadProvider.prototype.getContextPadEntries.call(this, element);
  var translate = this._translate,
    modeling = this._modeling;

  var di = getBusinessObject(element).di;
  
  function colorize() {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = di.fill;
    input.style.display = 'none';

    input.addEventListener('change', (event) => {
      const color = event.target.value;
      modeling.setColor(element, { fill: color });
      setTimeout(function () {
        document.body.removeChild(input);
      }, 0);
    }, false);

    document.body.appendChild(input);
    input.click();
  }

  if ((is(di, 'bpmndi:BPMNPlane') || is(di, 'bpmndi:BPMNShape')) && !is(element, 'bpmn:Group')) {
    assign(actions, {
      'color-picker': {
        group: 'edit',
        className: 'bpmn-icon-colorize',
        title: translate('Colorize'),
        action: {
          click: colorize
        }
      }
    });
  }
  return actions;
}