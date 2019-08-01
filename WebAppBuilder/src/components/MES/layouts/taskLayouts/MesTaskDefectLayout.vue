<template>
     <v-layout>
        <v-flex>
            <grid-layout
                class="main-layout"
                :layout="blocks"
                :col-num="12"
                :row-height="30"
                :is-draggable="true"
                :is-resizable="true"
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
               </grid-item>
            </grid-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    selectedTask: Object
  },
  data: function(){
     let blocks = [
        {'x':0, 'y':0, 'w':4, 'h':6, 'i':'0'},
        {'x':0, 'y':6, 'w':4, 'h':4, 'i':'1'},
        {'x':4, 'y':6, 'w':4, 'h':4, 'i':'2'}
      ];
    return {blocks};
  },
  name: "mes-task-defect-layout",

    methods: {
  }
}
</script>
<style type="text/css" scoped>
.main-layout {
    overflow-y: auto;
    height: 89vh !important;
    padding: 0 10px !important;
  }
 .grid-element {
    background-color: cornflowerblue;
  }
</style>
