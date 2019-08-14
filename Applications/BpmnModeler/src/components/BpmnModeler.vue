<template>
  <div id="modeler">

  </div>
</template>
<script>
import Modeler from 'bpmn-js/lib/Modeler'

export default {
  name: 'bpmn-modeler',
  data: function data() {
    return {
      modeler: { }
    }
  },
  created: function created() {
    this.modeler = new Modeler({ container: '#modeler' })
  }
}
</script>
<style>
</style>
