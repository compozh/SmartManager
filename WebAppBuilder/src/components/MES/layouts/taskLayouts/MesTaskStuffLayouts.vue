<template>
    <v-layout class="mes-task-stuff-layout">
      <div class="installations-block" v-for="(installationsByWorkCenters, workCenter) in installations" :key="workCenter">
      <v-card class="installation-card" v-for="installation in installationsByWorkCenters" :key="installation.id">
         <mes-installation-card :installation=installation @removeInstallation="removeInstallation(installation, workCenter)"/>
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
.installations-block {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.installation-card{
  display: flex;
  align-items: center;
  max-width: 400px;
  margin: 10px;
  width: 360px;
}
</style>
