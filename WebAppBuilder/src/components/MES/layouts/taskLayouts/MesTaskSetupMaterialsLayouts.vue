<template>
    <v-layout>
      <v-card class="card" v-for="installation in installations" :key="installation.id">
         <mes-installation :installation=installation @removeInstallation="removeInstallation(installation)"/>
      </v-card>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    selectedTask: Object,
    installations: Array
  },
  name: "mes-task-setup-materials-layout",
    methods: {
      removeInstallation(installation) {
        this.$emit('removeInstallation', installation);
      }
    }
}
</script>
<style type="text/css" scoped>
</style>
