<template>
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
                        class="grid-element">
                        <div class="grid-item-data">
                        <mes-form-builder v-if="item.i == '0'"
                          ref="formioBuilder"
                          :workCenter=workCenters[selectedTask.workCenterCode]
                          @formioSubmit=formioSubmit />
                       <span  v-if="item.i != '0'" v-html="item.data"></span>
                       </div>
               </grid-item>
            </grid-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import VueGridLayout from '../../../../../node_modules/vue-grid-layout';

export default {
   name: "mes-accept-task-layout",
   props: {
    selectedTask: Object,
    workCenters: Object,
    dragResizeMode: Boolean
  },
  components: {GridLayout: VueGridLayout.GridLayout,
           GridItem: VueGridLayout.GridItem
           },
  computed: {
    blocks() {
      return [
        {'x':0, 'y':0, 'w':12, 'h':3, 'i':'1', data: this.selectedTask.detailedDescription},
        {'x':0, 'y':3, 'w':12, 'h':14, 'i':'0', ref: 'formio'}
      ];
    }
  },
  methods: {
    formioSubmit(data) {
      let workCenter = this.workCenters[this.selectedTask.workCenterCode];
      this.$store.dispatch('mes/productionFormIoSubmit', { workCenter, data, task: this.selectedTask });
    },
    getFormioData() {
      return this.$refs.formioBuilder[0].getFormioData();
    },
    getInitialFormioData() {
      return this.$refs.formioBuilder[0].formioData;
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
</style>
