import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import camundaExtensionModule from 'camunda-bpmn-moddle/lib';
import camundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda';
import workflowBpmnModdle from '../bpmnModules/bpmn.json';
import bpmnPropertiesPanelCommands from '../bpmnModules/properties-panel/bpmn/cmd';

import DmnModeler from 'dmn-js/lib/Modeler';
import DmnViewer from 'dmn-js/lib/Viewer';
import camundaDmnModdle from 'camunda-dmn-moddle/resources/camunda';

import CmmnModeler from 'cmmn-js/lib/Modeler';
import CmmnViewer from 'cmmn-js/lib/NavigatedViewer';
import camundaCmmnModdle from 'camunda-cmmn-moddle/resources/camunda';
import workflowCmmnModdle from '../bpmnModules/cmmn.json';
import cmmnPropertiesPanelCommands from '../bpmnModules/properties-panel/cmmn/cmd';

import minimapModule from 'diagram-js-minimap';
import DiagramType from './models/DiagramType';
import ContextPadProvider from '../bpmnModules/context-pad/';

import WorkflowRules from '../bpmnModules/rules';

export default function editorFactory(type, readonly, editorContainer, translate) {
  switch (type) {
  case DiagramType.BPMN:
    return readonly ? createBpmnViewer(editorContainer, translate) : createBpmnModeler(editorContainer, translate);
  case DiagramType.DMN:
    return readonly ? createDmnViewer(editorContainer, translate) : createDmnModeler(editorContainer, translate);
  case DiagramType.CMMN:
    return readonly ? createCmmnViewer(editorContainer, translate) : createCmmnModeler(editorContainer, translate);
  default:
    return null;
  }
}

function createTranslationModule(translate) {
  return {
    translate: ['value', (t, r) => translate(t, r)]
  };
}

function createBpmnModeler(editorContainer, translate) {
  return new BpmnModeler({
    container: editorContainer,
    keyboard: {
      bindTo: document
    },
    additionalModules: [
      bpmnPropertiesPanelCommands,
      camundaExtensionModule,
      minimapModule,
      createTranslationModule(translate),
      ContextPadProvider,
      WorkflowRules
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
    },
    canvas: {
      deferUpdate: false
    }
  });
}

function createCmmnModeler(editorContainer, translate) {
  return new CmmnModeler({
    container: editorContainer,
    keyboard: {
      bindTo: document
    },
    additionalModules: [
      cmmnPropertiesPanelCommands,
      minimapModule,
      createTranslationModule(translate),
    ],
    moddleExtensions: {
      camunda: camundaCmmnModdle,
      workflow: workflowCmmnModdle
    }
  });
}

function createCmmnViewer(editorContainer, translate) {
  return new CmmnViewer({
    container: editorContainer,
    keyboard: {
      bindTo: document
    },
    additionalModules: [
      minimapModule,
      createTranslationModule(translate)
    ],
    moddleExtensions: {
      camunda: camundaCmmnModdle,
      workflow: workflowCmmnModdle
    },
    canvas: {
      deferUpdate: false
    }
  });
}

function createDmnModeler(editorContainer, translate) {
  return new DmnModeler({
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
    canvas: {
      deferUpdate: false
    }
  });
}
