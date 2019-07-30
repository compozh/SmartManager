<template>
     <v-layout>
        <v-flex>
            <grid-layout
                :layout="layout"
                :col-num="12"
                :row-height="30"
                :is-draggable="true"
                :is-resizable="true"
                :is-mirrored="false"
                :vertical-compact="true"
                :margin="[10, 10]"
                :use-css-transforms="true"
                >
                <grid-item v-for="item in layout" :key="item.i"
                        :x="item.x"
                        :y="item.y"
                        :w="item.w"
                        :h="item.h"
                        :i="item.i"
                        class="grid-element">
                    {{item.i}}
                </grid-item>
            </grid-layout>
        </v-flex>
    </v-layout>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
 data: function() {
    let layout = [
        {'x':0, 'y':0, 'w':4, 'h':4, 'i':'0'},
        {'x':4, 'y':0, 'w':4, 'h':4, 'i':'1'},
        {'x':8, 'y':0, 'w':4, 'h':4, 'i':'2'},
        {'x':0, 'y':4, 'w':4, 'h':4, 'i':'3'},
        {'x':4, 'y':4, 'w':4, 'h':4, 'i':'4'},
        {'x':8, 'y':4, 'w':4, 'h':4, 'i':'5'},
      ];
    return {layout};
  },  
  name: "mes-task-main-layout",

  computed:{

  },
    methods: {
      onCardClick(data){
        console.log(data)
      },

  }
}
</script>
<style type="text/css" scoped>
  .grid-element {
    background-color: cornflowerblue;
  }
</style>
