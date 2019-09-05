<template>
  <v-layout align-center justify-center column fill-height>
    <h2>{{$tc('bpmn.labels.SelectOrCreateProcess')}}</h2>
    <v-btn>{{$tc('bpmn.buttons.CreateProcess')}}</v-btn>
  </v-layout>
</template>
<script>
export default {
  name: 'bpmn-empty'
};
</script>
<style>
</style>
