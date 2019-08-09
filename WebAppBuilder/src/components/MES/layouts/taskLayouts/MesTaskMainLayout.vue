<template>
     <v-layout class="mes-task-main-layout">
        <v-flex>
            <grid-layout
                class="main-layout"
                :layout="blocks"
                :col-num="12"
                :row-height="30"
                :is-draggable="this.dragResizeMode"
                :is-resizable="this.dragResizeMode"
                :is-mirrored="false"
                :vertical-compact="true"
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
  props: {
    selectedTask: Object,
    dragResizeMode: Boolean
  },
 data() {
    let blocks = [
        {'x':0, 'y':0, 'w':6, 'h':6, 'i':'0', data: this.selectedTask.detailedDescription}
      ];

    return {blocks};
  },
  name: "mes-task-main-layout",
}
</script>
<style type="text/css" scoped>
   /*.mes-task-main-layout {
     padding-top: 30px;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    position: absolute;
  }*/
  .main-layout {
    padding: 0 10px !important;
  }
  .grid-element {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
</style>
