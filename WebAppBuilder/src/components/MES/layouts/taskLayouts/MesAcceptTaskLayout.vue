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
                <grid-item
                        :x="0"
                        :y="0"
                        :w="12"
                        :h="12"
                        :i="'0'"
                        :isDraggable=false
                        class="grid-element">
                       <mes-form-builder/>
               </grid-item>
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
    selectedTask: Object
  },
  data: function(){
     let blocks = [
        {'x':0, 'y':12, 'w':6, 'h':6, 'i':'1', data: this.selectedTask.detailedDescription},
      ];
    return {blocks};
  },
  name: "mes-accept-task-layout",

  computed:{

  },
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
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
</style>
