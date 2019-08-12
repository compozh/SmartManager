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
  .main-layout {
    padding: 0 10px !important;
  }
  .grid-element {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
</style>
