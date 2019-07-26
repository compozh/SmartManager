<template>
  <div>
    <v-container fluid pa-0>
      <v-layout column>
        <v-flex xs12 row>
            <v-list>
            <v-list-tile
              v-ripple
              v-for="item in menu"
              :key="item.id"
               @click="applyMenuItem(item.id)">
              <span>{{item.name}}</span>
            </v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name:"mes-menu",
  data () {
    var items = [
      {name: 'Tasks', id:'taskMenu'},
      {name: 'Downtimes', id:'downtimesMenu'},
      {name: 'Productions', id:'productionsMenu'}]
    return {menu: items}
  },
  created(){
  },
  computed: {
  },
  methods: {
    applyMenuItem(code){
      debugger;
      console.log(code)
    }
  }
}
</script>
