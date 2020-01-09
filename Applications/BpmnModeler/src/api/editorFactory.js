import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import camundaExtensionModule from 'camunda-bpmn-moddle/lib';
import camundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda';
import workflowBpmnModdle from '../bpmnModules/WorkflowPackage.json';

import DmnJS from '../bpmnModules/dmn-modeler.development';
import DmnViewer from 'dmn-js/lib/Viewer';
import camundaDmnModdle from 'camunda-dmn-moddle/resources/camunda';

import minimapModule from 'diagram-js-minimap';
import DiagramType from './models/DiagramType';
import ContextPadProvider from '../bpmnModules/context-pad/';
import propertiesPanelCommands from '../bpmnModules/properties-panel/cmd';

export default function editorFactory(type, readonly, editorContainer, propertiesPanelContainer, translate) {
  switch (type) {
  case DiagramType.BPMN:
    return readonly ? createBpmnViewer(editorContainer, translate) : createBpmnModeler(editorContainer, translate);
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

function createBpmnModeler(editorContainer, translate) {
  return new BpmnModeler({
    container: editorContainer,
    keyboard: {
      bindTo: document
    },
    additionalModules: [
      propertiesPanelCommands,
      camundaExtensionModule,
      minimapModule,
      createTranslationModule(translate),
      ContextPadProvider
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