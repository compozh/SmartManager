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
                        <mes-form-builder v-if="item.i == '0'" :formioData=formioData @formioSubmit=formioSubmit />
                       <span  v-if="item.i != '0'" v-html="item.data"></span>
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
    formioData: Object
  },
  data: function(){
    let blocks = [
        {'x':0, 'y':0, 'w':11, 'h':11, 'i':'0'},
        {'x':0, 'y':12, 'w':6, 'h':6, 'i':'1', data: this.selectedTask.detailedDescription},
      ];
    return {blocks: blocks};
  },
  name: "mes-accept-task-layout",
  methods: {
    formioSubmit(params) {
      debugger;
      //this.$store.dispatch('mes/productionFormIoSubmit', workCenter.productionRegistrationFormCode);
    }
  }
}
</script>
<style type="text/css" scoped>
.main-layout {
    overflow-y: auto;
    height: 88vh !important;
    padding: 0 10px !important;
  }
 .grid-element {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
</style>
