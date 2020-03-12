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
    popupMenu = this._popupMenu,
    canvas = this._canvas,
    contextPad = this._contextPad,
    modeling = this._modeling;

  var di = getBusinessObject(element).di,
    palette = {
      default: {fill: '#ffffff', stroke: '#000000'},
      blue: {fill: '#bedffb', stroke: '#4aa0eb'},
      orange: {fill: '#ffe1b5', stroke: '#fb910b'},
      green: {fill: '#cae7cb', stroke: '#43a047'},
      red: {fill: '#ffcfd4', stroke: '#e74a46'},
      purple: {fill: '#e2c1e8', stroke: '#8e24aa'},
    };

  const popupMenuProvider = {
    getPopupMenuEntries: function(element) {
      var result = {};
      Object.keys(palette).forEach(item => {
        result[('entry' + item)] = {
          className: 'palette-' + item,
          label: item,
          action: () => {
            modeling.setColor(element, {stroke: palette[item].stroke,  fill: palette[item].fill});
          }
        };
      });

      return result;
    }
  };

  popupMenu.registerProvider('colorPalette', popupMenuProvider);

  function colorize(event, element, popupMenu) {
    var position = assign(getReplaceMenuPosition(element), {
      cursor: { x: event.x, y: event.y }
    });
    popupMenu.open(element, 'colorPalette', position);
  }

  function getReplaceMenuPosition(element) {
    var Y_OFFSET = 5;

    var diagramContainer = canvas.getContainer(),
      pad = contextPad.getPad(element).html;

    var diagramRect = diagramContainer.getBoundingClientRect(),
      padRect = pad.getBoundingClientRect();

    var top = padRect.top - diagramRect.top;
    var left = padRect.left - diagramRect.left;

    var pos = {
      x: left,
      y: top + padRect.height + Y_OFFSET
    };

    return pos;
  }

  if ((is(di, 'bpmndi:BPMNPlane') || is(di, 'bpmndi:BPMNShape') || is(di, 'bpmndi:BPMNEdge')) && !is(element, 'bpmn:Group')) {
    assign(actions, {
      'color-picker': {
        group: 'edit',
        className: 'bpmn-icon-colorize',
        title: translate('Colorize'),
        action: {
          click: () => { colorize(event, element, popupMenu); }
        }
      }
    });
  }
  return actions;
};

