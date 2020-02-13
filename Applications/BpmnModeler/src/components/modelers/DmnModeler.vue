<template>
  <modeler-layout 
      :diagram="decision" :loading.sync="loading" :saved="saved" :canShowPanel="false" :noAccess="noAccess"
      :canMinimap="canMinimap" @minimap="onMinimap" 
      :canUndo="canUndo" :canRedo="canRedo" @undo="onUndo" @redo="onRedo"
      :canZoom="canZoom" @zoom-in="onZoomIn" @zoom-out="onZoomOut" @zoom-reset="onZoomReset"
    >
    <template #modeler>
      <v-tabs
        show-arrows
        height="40"
        color="transparent"
        v-model="activeView"
        slider-color="primary"
      >
        <v-tab v-for="view in views" :key="view.element.id">
          <span class="dmn-tab-icon" :class="[ viewIcons[view.type] ]"></span>
          <span>{{ view.element.name || view.element.id }}</span>
        </v-tab>
      </v-tabs>
      <div class="dmn-modeler-container" ref="container"></div>
    </template>
    <template #propertiesPanel>
      <div ref="propertiesPanel"></div>
    </template>
    <template #tab="{ item: view }">
      <span class="dmn-tab-icon" :class="[ viewIcons[view.type] ]"></span>
      <span>{{ view.element.name || view.element.id }}</span>
    </template>
  </modeler-layout>
</template>
<script>
import 'dmn-js/dist/assets/diagram-js.css';
import 'dmn-js/dist/assets/dmn-js-shared.css';
import 'dmn-js/dist/assets/dmn-js-drd.css';
import 'dmn-js/dist/assets/dmn-js-decision-table.css';
import 'dmn-js/dist/assets/dmn-js-decision-table-controls.css';
import 'dmn-js/dist/assets/dmn-js-literal-expression.css';
import 'dmn-js/dist/assets/dmn-font/css/dmn.css';
import 'dmn-js/dist/assets/dmn-font/css/dmn-embedded.css';
import 'dmn-js/dist/assets/dmn-font/css/dmn-codes.css';
import 'dmn-js/dist/assets/dmn-font/css/animation.css';

import { debounce } from 'throttle-debounce';
import InitialDiagram from '../../bpmnModules/initialDiagram.dmn';
import { Diagram, DiagramType, AccessRights } from '../../api/models';
import { CancellationToken, SavingContext, editorFactory } from '../../api';
import { editorToolbarMixin, exportMixin } from '../mixins';
import { Notification } from 'element-ui';

export default {
  name: 'dmn-modeler',
  mixins: [ exportMixin, editorToolbarMixin ],
  data() {
    return {
      modeler: null,
      activeEditor: null,
      loading: false,
      saved: false,
      cancellationToken: new CancellationToken(),
      onElementChanged: null,
      canShowPanel: true,
      activeView: null,
      views: [],
      viewIcons: {
        drd: 'dmn-icon-lasso-tool',
        decisionTable: 'dmn-icon-decision-table',
        literalExpression: 'dmn-icon-literal-expression'
      }
    };
  },
  mounted() {
    if (this.decision) {
      this.createModeler();
      this.onActiveModelChanged();
    }
  },
  computed: {
    decision() {
      const activeItem = this.$store.state.bpmn.activeItem;
      if (activeItem && activeItem instanceof Diagram && activeItem.type === DiagramType.DMN) {
        return activeItem;
      }
      return null;
    },
    noAccess() {
      return this.decision && !this.decision.hasRight(AccessRights.Read);
    }
  },
  beforeDestroy: function () {
    this.destroyModeler();
  },
  watch: {
    decision(value, oldValue) {
      if (!value) {
        this.destroyModeler();
        return;
      }
      if (!oldValue || !this.modeler || value.type !== oldValue.type || (value.hasRight(AccessRights.Write) !== oldValue.hasRight(AccessRights.Write))) {
        this.createModeler();
      }
      this.onActiveModelChanged();
    },
    activeView(value) {
      if (!this.modeler) {
        return;
      }
      var view = this.modeler.getViews()[value];
      this.modeler.open(view);
    }
  },
  methods: {
    createModeler() {
      this.destroyModeler();
      const canEdit = this.decision.hasRight(AccessRights.Write);
      this.canShowPanel = canEdit;
      this.modeler = editorFactory(this.decision.type, !canEdit, this.$refs.container, this.$refs.propertiesPanel, this.translate);
      this.modeler.on('views.changed', ({ views, activeView }) => {
        this.views = views;
        this.activeView = views.indexOf(activeView);
        
        var editor = this.modeler.getActiveViewer();
        if (this.activeEditor === editor) {
          return;
        }

        if (this.activeEditor) {
          if (this.onElementChanged) {
            this.activeEditor.off('commandStack.changed', this.onElementChanged);
          }
          this.activeEditor.off('commandStack.changed', this.onCanUndoRedo);
        }
        this.onElementChanged = debounce(1000, function() {
          this.saveXML();
        });
        editor.on('commandStack.changed', this.onElementChanged, new SavingContext(this.modeler, this.decision.id, (id, xml) => this.setXML(id, xml)));
        editor.on('commandStack.changed', this.onCanUndoRedo);
        this.activeEditor = editor;
        this.onEditorChanged();
      });
    },    
    async loadXml() {
      if (!this.decision || !this.modeler) {
        return;
      }
      this.loading = true;
      if (!this.cancellationToken.isCancelled) {
        this.cancellationToken.cancel();
      }
      const debounced = debounce(500, async (cancellationToken) => {
        const xml = await this.$store.dispatch('bpmn/getXml', this.decision.id);
        if (cancellationToken.isCancelled) {
          return;
        }
        if (xml === false) {
          this.loading = false;
          Notification.error(this.$t('bpmn.Errors.ProcessesNotLoaded'));
          return;
        }
        if (!xml || xml === '') {
          this.modeler.importXML(InitialDiagram, (error) => {
            if (error) {
              console.error(error);
            }
            this.loading = false;
          }); 
        } else {
          this.modeler.importXML(xml, (err) => {
            this.loading = false;
            if (err) {
              console.error(err);
              Notification.error(this.$t('bpmn.Errors.ProcessesNotImported'));
              var activeEditor = this.modeler.getActiveViewer();

              activeEditor.createDiagram();
              this.loading = false;
            }
          });
        }
      });

      this.cancellationToken = new CancellationToken(debounced);
      debounced(this.cancellationToken);
    },
    setXML(id, xml) {
      this.$store.dispatch('bpmn/setXml', { id, xml }).then(success => {
        if (success) {
          this.saved = true;
          setTimeout(() => this.saved = false, 1000);
        } else {
          Notification.error(this.$t('bpmn.Errors.ProcessesNotSaved'));
        }
      });
      this.$store.dispatch('bpmn/editProcess', this.decision);
      const { item, index } = this.$store.getters['bpmn/getItemById'](this.decision.parentId);
      this.$store.dispatch('bpmn/editFolder', item);
    },
    onActiveModelChanged() {
      if (!this.decision || !this.modeler || this.noAccess) {
        return;
      }
      //this.modeler.clear();
      this.loadXml();
    },
    translate(template, replacements) {
      const translationPrefix = 'bpmn.dmn-modeler.';
      replacements = replacements || {};

      for (let replacement in replacements) {
        // Попробовать перевести замены
        const translationKey = translationPrefix + replacements[replacement.replace(/^\|+|\.+$/g, '')];
        const translation = this.$t(translationKey);
        if (translation != translationKey) {
          replacements[replacement] = translation;
        }
      }

      // Перевести шаблон
      const translationKey = translationPrefix + template.replace(/^\|+|\.+$/g, '');
      const translation = this.$t(translationKey, replacements);

      if (translation !== translationKey) {
        return translation;
      } else {
        return template.replace(/{([^}]+)}/g, function(_, key) {
          return replacements[key] || '{' + key + '}';
        });
      }
    },
    destroyModeler() {
      if (this.modeler) {
        this.modeler.destroy();
        this.modeler = null;
        this.activeEditor = null;
      }
    },
    getEditorModule(module) {
      if (!this.modeler || !this.activeEditor) {
        return;
      }
      try {
        return this.activeEditor.get(module);
      } catch (error) {
        return false;
      }
    }
  }
};
</script>
<style scoped>

.dmn-modeler-container {
  width: 100%;
  height: calc(100% - 41px);
  position: absolute;
  overflow: auto;
}
.dmn-literal-expression-container .powered-by-logo,
.dmn-decision-table-container .powered-by-logo {
  z-index: 4;
}
.dmn-literal-expression-container,
.dmn-decision-table-container {
  padding: 10px;
  overflow: auto;
}
.dmn-tab-icon {
  font-size: 18px;
  padding-right: 6px;
}
div[data-group="historyConfiguration"] {
  display: none;
}
div[data-entry="id"] > .dpp-field-description {
  display: none;
}
.v-tab {
  color: black !important
}
</style>