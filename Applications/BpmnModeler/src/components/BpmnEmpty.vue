<template>
  <v-layout align-center justify-center column fill-height>
    <h2>{{$t('bpmn.labels.SelectOrCreateProcess')}}</h2>
    <v-btn @click="addProcess">{{$t('bpmn.buttons.AddProcess')}}</v-btn>
  </v-layout>
</template>
<script>
export default {
  name: 'bpmn-empty',
  methods: {
    addProcess() {
      this.$router.app.$emit('add-process');
    }
  }
};
</script>
<style>
</style>
