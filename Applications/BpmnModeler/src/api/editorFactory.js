import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import bpmnPropertiesPanelModule from 'bpmn-js-properties-panel';
import bpmnPropertiesProviderModule from '../bpmnModules/provider/workflow/';
import camundaExtensionModule from 'camunda-bpmn-moddle/lib';
import camundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda';
import workflowBpmnModdle from '../bpmnModules/WorkflowPackage.json';

import DmnJS from '../bpmnModules/dmn-modeler.development';
import DmnViewer from 'dmn-js/lib/Viewer';
import dmnPropertiesPanelModule from 'dmn-js-properties-panel';
import drdAdapterModule from 'dmn-js-properties-panel/lib/adapter/drd';
import decisionTableAdapterModule from 'dmn-js-properties-panel/lib/adapter/decision-table';
import literalExpressionAdapterModule from 'dmn-js-properties-panel/lib/adapter/literal-expression';
import dmnPropertiesProviderModule from 'dmn-js-properties-panel/lib/provider/camunda';
import camundaDmnModdle from 'camunda-dmn-moddle/resources/camunda';

import minimapModule from 'diagram-js-minimap';
import DiagramType from './models/DiagramType';

export default function editorFactory(type, readonly, editorContainer, propertiesPanelContainer, translate) {
  switch (type) {
  case DiagramType.BPMN:
    return readonly ? createBpmnViewer(editorContainer, translate) : createBpmnModeler(editorContainer, propertiesPanelContainer, translate);
  case DiagramType.DMN:
    return readonly ? createDmnViewer(editorContainer, translate) : createDmnModeler(editorContainer, propertiesPanelContainer, translate);
  default:
    return null;
  }
}

function createTranslationModule(translate) {
  return {
    translate: ['value', (t, r) => translate(t, r)]
  }
}

function createBpmnModeler(editorContainer, propertiesPanelContainer, translate) {
  return new BpmnModeler({
    container: editorContainer,
    keyboard: {
      bindTo: document
    },
    propertiesPanel: {
      parent: propertiesPanelContainer
    },
    additionalModules: [
      bpmnPropertiesPanelModule,
      bpmnPropertiesProviderModule,
      camundaExtensionModule,
      minimapModule,
      createTranslationModule(translate)
    ],
    moddleExtensions: {
      camunda: camundaBpmnModdle,
      workflow: workflowBpmnModdle
    }
  });
}

function createBpmnViewer(editorContainer, translate) {
  return new BpmnViewer({
    container: editorContainer,
    keyboard: {
      bindTo: document
    },
    additionalModules: [
      camundaExtensionModule,
      minimapModule,
      createTranslationModule(translate)
    ],
    moddleExtensions: {
      camunda: camundaBpmnModdle,
      workflow: workflowBpmnModdle
    }   
  });
}

function createDmnModeler(editorContainer, propertiesPanelContainer, translate) {
  return new DmnJS({
    common: {
      keyboard: {
        bindTo: document
      },
      moddleExtensions: {
        camunda: camundaDmnModdle
      }
    },
    drd: {
      propertiesPanel: {
        parent: propertiesPanelContainer
      },
      additionalModules: [
        dmnPropertiesPanelModule,
        dmnPropertiesProviderModule,
        drdAdapterModule,
        minimapModule,
        createTranslationModule(translate)
      ]
    },
    decisionTable: {
      propertiesPanel: {
        parent: propertiesPanelContainer
      },
      additionalModules: [
        dmnPropertiesPanelModule,
        dmnPropertiesProviderModule,
        decisionTableAdapterModule,
        createTranslationModule(translate)
      ]
    },
    literalExpression: {
      propertiesPanel: {
        parent: propertiesPanelContainer
      },
      additionalModules: [
        dmnPropertiesPanelModule,
        dmnPropertiesProviderModule,
        literalExpressionAdapterModule,
        createTranslationModule(translate)
      ]
    },
    container: editorContainer,
  });
}

function createDmnViewer(editorContainer, translate) {
  return new DmnViewer({
    container: editorContainer,
    common: {
      keyboard: {
        bindTo: document
      },
      moddleExtensions: {
        camunda: camundaDmnModdle
      }
    },
    drd: {
      additionalModules: [
        minimapModule,
        createTranslationModule(translate)
      ]
    },
    decisionTable: {
      additionalModules: [
        createTranslationModule(translate)
      ]
    },
    literalExpression: {
      additionalModules: [
        createTranslationModule(translate)
      ]
    },
  });
}