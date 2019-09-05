<template>
<v-layout class="task-in-progress-layout-block">
  <mes-task-in-progress-layout-toolbar />

     <v-layout class="mes-accept-task-layout">
        <v-flex class="mes-accept-task-flex">
            <grid-layout
                class="grid-layout"
                :layout="blocks"
                :col-num="12"
                :row-height="30"
                :is-draggable="this.dragResizeMode"
                :is-resizable="this.dragResizeMode"
                :is-mirrored="false"
                :margin="[20, 20]"
                :vertical-compact="false"
                :use-css-transforms="true"
                >
               <grid-item v-for="item in blocks"
                        :ref="item.ref"
                        :key="item.i"
                        :x="item.x"
                        :y="item.y"
                        :w="item.w"
                        :h="item.h"
                        :i="item.i"
                        :style="!dragResizeMode ? 'box-shadow: none;' : ''"
                        class="grid-element">
                        <div class="grid-item-data formio-block" v-if="item.i == '0'">
                          <mes-form-builder
                            ref="formioBuilder"
                            type="taskForm"
                            @formioSubmit=formioSubmit />
                        </div>
                        <div class="grid-item-data" v-if="item.i != '0'">
                          <span v-html="item.data"></span>
                        </div>
               </grid-item>
            </grid-layout>
        </v-flex>
    </v-layout>
</v-layout>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'

export default {
  name: 'mes-task-in-progress-layout',
  components: { GridLayout: VueGridLayout.GridLayout, GridItem: VueGridLayout.GridItem },
  computed: {
    blocks() {
      return [
        {'x': 0, 'y': 0, 'w': 12, 'h': 3, 'i': '1', data: this.selectedTask.detailedDescription},
        {'x': 0, 'y': 3, 'w': 12, 'h': 12, 'i': '0', ref: 'formio'}
      ]
    },
    dragResizeMode() {
      return this.$store.getters['mes/dragResizeMode']
    },
    selectedTask() {
      return this.$store.getters['mes/selectedTask']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    }
  },
  methods: {
    formioSubmit(data) {
      this.$store.dispatch('mes/productionFormIoSubmit', { workCenter: this.workCenter, data, task: this.selectedTask })
    },
    getFormioData() {
      return this.$refs.formioBuilder[0].getFormioData()
    }
  }
}
</script>
<style type="text/css" scoped>
  .mes-accept-task-layout .mes-accept-task-flex {
    position: absolute;
    height: calc(100% - 60px);
    overflow-y: auto;
    width: 100%;
  }
  .mes-accept-task-layout .mes-accept-task-flex::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .mes-accept-task-layout .mes-accept-task-flex::-webkit-scrollbar-track {
      background-color:#fff
  }
  .mes-accept-task-layout .mes-accept-task-flex::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
  .mes-accept-task-layout .mes-accept-task-flex::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .mes-accept-task-layout .mes-accept-task-flex::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .mes-accept-task-layout .mes-accept-task-flex::-webkit-scrollbar-button {display:none}

  .grid-layout {
    padding: 0 10px !important;
  }
 .grid-element {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
  }
  .grid-item-data{
    overflow-y: auto;
    overflow-x: auto;
    height: inherit;
    padding: 0 15px;
    text-align: center;
  }
  .grid-item-data::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .grid-item-data::-webkit-scrollbar-track {
      background-color:#fff
  }
  .grid-item-data::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .grid-item-data::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .grid-item-data::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .grid-item-data::-webkit-scrollbar-button {display:none}

  .task-in-progress-layout-block {
    display: block;
    width: 100%;
  }
</style>
