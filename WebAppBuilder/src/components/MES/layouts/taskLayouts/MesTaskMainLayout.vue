<template>
     <v-layout class="mes-task-main-layout">
        <v-flex class="mes-task-main-flex">
            <grid-layout
                class="main-layout"
                :layout="blocks"
                :col-num="12"
                :row-height="30"
                :is-draggable="this.dragResizeMode"
                :is-resizable="this.dragResizeMode"
                :is-mirrored="false"
                :vertical-compact="false"
                :margin="[20, 20]"
                :use-css-transforms="true"
                >
                <grid-item v-for="item in blocks" :key="item.i"
                        :x="item.x"
                        :y="item.y"
                        :w="item.w"
                        :h="item.h"
                        :i="item.i"
                        class="grid-element">
                        <span v-html="item.data"></span>
                </grid-item>
            </grid-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-task-main-layout",
  props: {
    selectedTask: Object,
    dragResizeMode: Boolean
  },
  computed: {
    blocks() {
      return [ {'x':0, 'y':0, 'w':7, 'h':7, 'i':'0', data: this.selectedTask.detailedDescription } ];
    }
  }
}
</script>
<style type="text/css" scoped>
.mes-task-main-layout  .mes-task-main-flex{
  position: absolute;
  height: calc(100% - 60px);
  overflow-y: auto;
  width: 100%;
}
.mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-track {
      background-color:#fff
  }
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-button {display:none}
  .main-layout {
    padding: 0 10px !important;
  }
  .grid-element  {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
</style>
