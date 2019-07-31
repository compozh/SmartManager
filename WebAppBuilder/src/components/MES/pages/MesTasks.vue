<template>
<v-container  class="main-block">
    <v-layout row wrap >
      <v-flex xs4 class="tasks-component">
        <v-card>
          <v-layout column>
              <mes-tasks-component/>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs8>
        <v-card>
          <v-layout column wrap>
            <v-flex class="button-toolbar">
              <mes-tasks-toolbar/>
            </v-flex>
            {{layout}}
            <mes-task-main-layout/>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-tasks",
  props: {
    layout: String,
  },
  methods: {
      onCardClick(data){
        console.log(data)
      }
  }
}
</script>
<style type="text/css" scoped>
  .list-block .card {
    display: flex;
    flex-direction: column;
    /* width: 400px; */
    margin: 20px;
    border-radius: 20px;
  }

  .main-block {
    height: 100%;
    padding: 0 !important;
    margin: 0 !important;
  }
</style>
