import RulesModule from 'diagram-js/lib/features/rules';

import WorkflowRules from './WorkflowRules';

export default {
  __depends__: [
    RulesModule
  ],
  __init__: ['workflowRules'],
  workflowRules: ['type', WorkflowRules]
};
