<template>
     <v-layout id="mainLayout">
        <v-flex>
            <grid-layout
                class="grid-layout"
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
                        <mes-form-builder v-if="item.i == '0'"
                        ref="formioBuilder"
                        :workCenter=workCenters[selectedTask.workCenterCode]
                        @formioSubmit=formioSubmit />
                       <span  v-if="item.i != '0'" v-html="item.data"></span>
               </grid-item>
            </grid-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
   name: "mes-accept-task-layout",
   props: {
    selectedTask: Object,
    workCenters: Object,
    dragResizeMode: Boolean
  },
  computed: {
    blocks() {
      return [
        {'x':0, 'y':0, 'w':11, 'h':11, 'i':'0'},
        {'x':0, 'y':12, 'w':7, 'h':7, 'i':'1', data: this.selectedTask.detailedDescription},
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
.grid-layout {
    padding: 0 10px !important;
  }
 .grid-element {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
</style>
