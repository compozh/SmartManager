<template>
<v-container  class="main-block">
  <v-card>
    <v-layout row>
      <v-flex xs4 class="tasks-list">
        <mes-tasks-component/>
      </v-flex>
      <v-flex xs8 class="task-description">
          <v-layout column wrap>
            <v-flex class="button-toolbar">
              <mes-tasks-toolbar :layout=layout @layout="changeLayout" />
            </v-flex>
            <mes-task-main-layout v-if="layout === 'mes-task-main-layout'" />
            <mes-accept-task-layout v-if="layout == 'mes-accept-task-layout'" />
            <mes-task-defect-layout v-if="layout == 'mes-task-defect-layout'" />
            <mes-task-setup-materials-layout v-if="layout == 'mes-task-setup-materials-layout'" />
          </v-layout>
      </v-flex>
    </v-layout>
    </v-card>
  </v-container>

</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-tasks",
  /*props: {
    layout: String
  },*/
  data: function() {
    return { layout: 'mes-task-main-layout'};
  },
  methods: {
      onCardClick(data){
        console.log(data)
      },
       changeLayout(newLayout){
         this.layout = newLayout;
      }
  },

}
</script>
<style type="text/css" scoped>
  .main-block {
    padding: 0 !important;
    margin: 0 !important;
  }
  /* .tasks-list{
overflow-y: scroll;
  } */
  /* .task-description{
    overflow-y: scroll;
  } */
</style>
