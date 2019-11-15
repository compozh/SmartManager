<template>
<v-layout column fill-height>
  <v-tabs
    v-model="currentTab"
    class="properties-panel"
  >
    <v-tab v-for="tab in tabs" :key="tab.key" :href="`#tab-${tab.key}`">{{ tab.title }}</v-tab>
    <v-tab-item v-for="tab in tabs" :key="tab.key" :value="`tab-${tab.key}`">
      <properties-panel-tab :tab="tab"></properties-panel-tab>
    </v-tab-item>
  </v-tabs>
</v-layout>
</template>
<script>
import PropertiesPanelTab from './PropertiesPanelTab';

export default {
  name: 'properties-panel',
  components: { PropertiesPanelTab },
  props: {
    modeler: {
      required: true
    },
    propertiesProvider: {
      required: true
    }
  },
  data() {
    return {
      eventBus: null,
      canvas: null,
      currentElement: null,
      tabs: [],
      currentTab: null
    }
  },
  watch: {
    modeler(val, oldVal) {
      if (oldVal) {
        this.detachEvents(oldVal);
      }
      this.initialize();
    },
    propertiesProvider(val) {
      const selection = this.getModule('selection');
      if (!selection) {
        return;
      }
      const selectedElement = selection.get()[0];
      if (!selectedElement || isImplicitRoot(this.element)) {
        return;
      }
      this.tabs = val.getTabs(selectedElement);
    }
  },
  beforeDestroy() {
    if (this.modeler) {
      this.detachEvents(this.modeler);
    }
  },
  methods: {
    initialize() {
      this.eventBus = this.getModule('eventBus');
      this.canvas = this.getModule('canvas');
      this.attachEvents(this.modeler);
    },
    attachEvents(modeler) {
      const eventBus = modeler.get('eventBus');
      if (!eventBus) {
        return;
      }
      eventBus.on('root.added', this.onRootAdded);
      eventBus.on('diagram.destroy', this.onDiagramDestroy);
      eventBus.on('elements.changed', this.onElementsChanged);
      eventBus.on('selection.changed', this.onSelectionChanged);
      eventBus.on('elementTemplates.changed', this.onElementTemplatesChanged);
    },
    detachEvents(modeler) {
      const eventBus = modeler.get('eventBus');
      if (!eventBus) {
        return;
      }
      eventBus.off('root.added', this.onRootAdded);
      eventBus.off('diagram.destroy', this.onDiagramDestroy);
      eventBus.off('elements.changed', this.onElementsChanged);
      eventBus.off('selection.changed', this.onSelectionChanged);
      eventBus.off('elementTemplates.changed', this.onElementTemplatesChanged);
    },
    update(element) {
      var currentElement = this.currentElement;
      if (typeof element === 'undefined') {
        // use RootElement of BPMN diagram to generate properties panel if no element is selected
        element = this.canvas.getRootElement();
      }
      this.tabs = this.propertiesProvider.getTabs(element);
      this.currentElement = element;
    },
    onRootAdded(e) {
      const element = e.element;

      if (isImplicitRoot(element)) {
        return;
      }

      this.update(element);
    },
    onSelectionChanged(e) {
      const newElement = e.newSelection[0];
      const rootElement = this.canvas.getRootElement();

      if (isImplicitRoot(rootElement)) {
        return;
      }

      this.update(newElement);
    },
    onElementsChanged(e) {
      var element = this.currentElement;
      
      if (element) {
        if (e.elements.indexOf(element) !== -1) {
          this.update(element);
        }
      }
    },
    onElementTemplatesChanged(e) {
      var element = this.currentElement;

      if (element) {
        this.update(element);
      }
    },
    onDiagramDestroy() {
      this.element = null;
    },

    getModule(module) {
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
}

function isImplicitRoot(element) {
  return element.id === '__implicitroot';
}
</script>
<style>
  .properties-panel .el-collapse-item__header {
    padding-left: 15px;
  }
  .properties-panel .el-collapse-item__content {
    padding: 0 15px;
  }
</style>