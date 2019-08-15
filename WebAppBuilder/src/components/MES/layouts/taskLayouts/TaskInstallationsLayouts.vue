<template>
    <v-layout class="mes-task-installations-layout">
      <mes-content-loader class="mes-content-loader" v-if="!initializeInstallations && !Object.keys(installations).length" />
      
      <mes-installations-component 
        :workCenterCodes=[selectedTask.workCenterCode]
        ref="installationCards"
      />
      
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-task-installations-layout",
  props: {
    selectedTask: Object,
    initializeInstallations: Boolean,
    installations: Object
  }
}
</script>

<style type="text/css" scoped>
  .mes-task-installations-layout {
    padding: 10px;
    margin-top: 60px;
    position: absolute;
    height: calc(100% - 60px);
    overflow-y: auto;
    width: 100%;
  }
  .mes-task-installations-layout::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .mes-task-installations-layout::-webkit-scrollbar-track {
      background-color:#fff
  }
  .mes-task-installations-layout::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .mes-task-installations-layout::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .mes-task-installations-layout::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .mes-task-installations-layout::-webkit-scrollbar-button {display:none}

  .mes-content-loader {
    width: 100%;
  }
</style>
