<template>
  <v-layout align-center justify-center column fill-height>
    <h2>Desicion</h2>
    <v-btn >{{ $t('bpmn.buttons.AddProcess') }}</v-btn>
  </v-layout>
</template>
<script>
// import { eventBus } from '../main';
// import { events } from '../constants';

export default {
  name: 'bpmn-decision',
  methods: {
    // addProcess() {
    //   eventBus.$emit(events.modeler.createDiagram);
    // }
  }
};
</script>
<style>
</style>
