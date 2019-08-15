<template>
    <v-layout class="mes-task-stuff-layout">
      <mes-content-loader class="mes-content-loader" v-if="!initializeInstallations && !Object.keys(installations).length" />
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
  name: "mes-task-stuff-layout",
  props: {
    selectedTask: Object,
    installations: Object,
    initializeInstallations: Boolean
  },
  methods: {
    removeInstallation(installation, workCenterCode) {
      this.$emit('removeInstallation', { installation, workCenterCode });
    }
  }
}
</script>

<style type="text/css" scoped>
  .mes-task-stuff-layout {
    padding: 10px;
    margin-top: 60px;
    position: absolute;
    height: calc(100% - 60px);
    overflow-y: auto;
    width: 100%;
  }
  .mes-task-stuff-layout::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .mes-task-stuff-layout::-webkit-scrollbar-track {
      background-color:#fff
  }
  .mes-task-stuff-layout::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .mes-task-stuff-layout::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .mes-task-stuff-layout::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .mes-task-stuff-layout::-webkit-scrollbar-button {display:none}
  .installations-block {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: start;
  }
  .mes-content-loader {
    width: 100%;
  }
  .installation-card{
    display: flex;
    align-items: center;
    max-width: 400px;
    margin: 10px;
    width: 360px;
    height: max-content;
  }
</style>
