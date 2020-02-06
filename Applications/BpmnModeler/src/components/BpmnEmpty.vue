<template>
  <v-row class="fill-height" align="center" justify="center" >
    <h2>{{ $t('bpmn.labels.SelectOrCreateProcess') }}</h2>
    <!-- <v-btn class="add-btn" @click="addProcess">
      {{ $t('bpmn.buttons.AddProcess') }}
    </v-btn>
    <v-btn  class="add-btn" @click="importItem(item)">
      {{ $t('bpmn.buttons.Import') }}
    </v-btn>
    <v-btn  class="add-btn"  @click="addFolder">
      {{ $t('bpmn.buttons.AddFolder') }}
    </v-btn> -->
  </v-row>
</template>
<script>
import { formMixin, importMixin, propertiesPanelEventsHandlersMixin } from './mixins';
import { eventBus } from '../main';
import { events } from '../constants';

export default {
  name: 'bpmn-empty',
  mixins: [ formMixin, importMixin, propertiesPanelEventsHandlersMixin ],
  methods: {
    addProcess() {
      eventBus.$emit(events.modeler.createDiagram);
    },
    addFolder() {
      this.createItem(this.$route.params.id, 'folder');
    },
  }
};
</script>
<style scoped lang="scss">
.add-btn {
  font-size: 11px;
  color: white !important;
  background-color: #1976d2 !important;
  height: 40px !important;
  margin-bottom: 10px
}
</style>
