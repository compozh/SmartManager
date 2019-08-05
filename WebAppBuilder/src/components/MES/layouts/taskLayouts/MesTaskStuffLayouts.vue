<template>
    <v-layout>
      <div v-for="(installationsByWorkCenters, workCenter) in installations" :key="workCenter">
      <v-card class="card" v-for="installation in installationsByWorkCenters" :key="installation.id">
         <mes-installation :installation=installation @removeInstallation="removeInstallation(installation, workCenter)"/>
      </v-card>
      </div>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    selectedTask: Object,
    installations: Object
  },
  name: "mes-task-stuff-layout",
    methods: {
      removeInstallation(installation, workCenterCode) {
        this.$emit('removeInstallation', { installation, workCenterCode });
      }
    }
}
</script>

<style type="text/css" scoped>
</style>
