<template>
  <modeler-layout :diagram="process" :loading.sync="loading" :saved="saved" :noAccess="noAccess"
    :canMinimap="canMinimap" @minimap="onMinimap"  :onlyRead="onlyRead"
    :canUndo="canUndo" :canRedo="canRedo" @undo="onUndo" @redo="onRedo"
    :canZoom="canZoom" @zoom-in="onZoomIn" @zoom-out="onZoomOut" @zoom-reset="onZoomReset"
  >
    <template #modeler>
      <div class="workflow-modeler" ref="container"></div>
    </template>
    <template #propertiesPanel>
      <properties-panel :modeler="modeler" :propertiesProvider="propertiesProvider"/>
    </template>
  </modeler-layout>
</template>
<script>
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

import { debounce } from 'throttle-debounce';
import { Diagram, DiagramType, AccessRights, DiagramVersion } from '../../api/models';
import { CancellationToken, SavingContext, editorFactory } from '../../api';
import { editorToolbarMixin, exportMixin } from '../mixins';
import BpmnPropertiesProvider from '../../bpmnModules/properties-panel/providers/BpmnPropertiesProvider';
import { Notification } from 'element-ui';

export default {
  name: 'bpmn-modeler',
  mixins: [ exportMixin, editorToolbarMixin ],
  // components: { ModelerLayout },
  data() {
    return {
      modeler: null,
      loading: false,
      saved: false,
      cancellationToken: new CancellationToken(),
      onElementChanged: null,
      propertiesProvider: null,
      elementRegistry: {},
      overlays: {}
    };
  },
  props: {
    onlyRead: {
      type: Boolean,
      default() {
        return false;
      }
    },
    diagram: Object
  },
  mounted() {
    if (this.process) {
      this.createModeler();
      this.onActiveModelChanged();
    }
  },
  computed: {
    process() {
      const activeItem = this.diagram || this.$store.state.bpmn.activeItem;
      if (activeItem && activeItem instanceof Diagram && activeItem.type === DiagramType.BPMN) {
        return activeItem;
      } else if(activeItem && activeItem instanceof DiagramVersion ) {
        let mainDiagram = this.$store.getters['bpmn/getItemById'](activeItem.diagramId).item
        return mainDiagram.type === DiagramType.BPMN ? mainDiagram : null
      }
      return null;
    },
    noAccess() {
      return this.process && !this.process.hasRight(AccessRights.Read);
    }
  },
  beforeDestroy: function () {
    this.destroyModeler();
  },
  watch: {
    process(value, oldValue) {
      if (!value) {
        this.destroyModeler();
        return;
      }
      if (!oldValue || !this.modeler || value.type !== oldValue.type || (value.hasRight(AccessRights.Write) !== oldValue.hasRight(AccessRights.Write))) {
        this.createModeler();
      }
      this.onActiveModelChanged();
    }
  },
  methods: {
    createModeler() {
      this.destroyModeler();
      const canEdit = this.process.hasRight(AccessRights.Write) && !this.onlyRead;
      this.modeler = editorFactory(this.process.type, !canEdit, this.$refs.container, null, this.translate);
      this.modeler.on('commandStack.changed', this.onCanUndoRedo);
      this.propertiesProvider = new BpmnPropertiesProvider(this.process, this.modeler, !canEdit);
      this.onEditorChanged();
    },    
    async loadXml() {
      if (!this.process || !this.modeler) {
        return;
      }
      this.loading = true;
      if (!this.cancellationToken.isCancelled) {
        this.cancellationToken.cancel();
      }
      const debounced = debounce(500, async (cancellationToken) => {
        let xml
        if(this.diagram && this.diagram instanceof DiagramVersion) {
          xml = await this.$store.dispatch('bpmn/getDiagramVersionXml', {versionId: this.diagram.versionId, diagramId: this.process.id})
        } else {
          xml = await this.$store.dispatch('bpmn/getXml', this.process.id);
        }
        if (cancellationToken.isCancelled) {
          return;
        }
        if (xml === false) {
          this.loading = false;
          Notification.error(this.$t('bpmn.Errors.ProcessesNotLoaded'));
          return;
        }
        if (!xml || xml === '') {
          this.modeler.createDiagram(() => {
            this.loading = false;
          });        
        } else {
          this.modeler.importXML(xml, (err) => {
            this.loading = false;
            this.overlays = this.modeler.get('overlays');
            this.elementRegistry = this.modeler.get('elementRegistry');
            this.$emit('compare');
            if (err) {
              console.error(err);
              Notification.error(this.$t('bpmn.Errors.ProcessesNotImported'));
              this.modeler.createDiagram();
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
      
      this.$store.dispatch('bpmn/editProcess', this.process);
      const { item, index } = this.$store.getters['bpmn/getItemById'](this.process.parentId);
      this.$store.dispatch('bpmn/editFolder', item);
    },
    onActiveModelChanged() {
      if (!this.process || !this.modeler || this.noAccess) {
        return;
      }
      this.modeler.clear();
      if (this.onElementChanged) {
        this.modeler.off('element.changed', this.onElementChanged);
      }
      this.onElementChanged = debounce(1000, function() {
        this.saveXML();
      });
      this.modeler.on('element.changed', this.onElementChanged, new SavingContext(this.modeler, this.process.id, (id, xml) => this.setXML(id, xml)));
      this.loadXml();
    },
    translate(template, replacements) {
      const translationPrefix = 'bpmn.bpmn-modeler.';
      replacements = replacements || {};

      for (let replacement in replacements) {
        // Попробовать перевести замены
        const translationKey = translationPrefix + replacements[replacement];
        const translation = this.$t(translationKey);
        if (translation != translationKey) {
          replacements[replacement] = translation;
        }
      }

      // Перевести шаблон
      const translationKey = translationPrefix + template;
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
      }
    },
    getEditorModule(module) {
      if (!this.modeler) {
        return false;
      }
      try {
        return this.modeler.get(module);
      } catch (error) {
        return false;
      }
    }
  }
};
</script>
<style >
</style>
