<template>
  <div>
    <v-container fluid pa-0>
      <v-layout column>
        <v-flex xs12 row>
            <v-list>
            <v-list-tile v-ripple v-for="item in menu" :key="item.id" :to="{name:item.id}">
              <v-list-tile-action>
                 <v-icon>{{item.image}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                  <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              </v-list-tile-content>
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
  computed: {
    menu () {
      let items = [
        {name: 'Задания', id:'tasks', image:'IT'},
        {name: 'Журнал работ', id:'schedule', image:'IT'},
        {name: 'Установка материалов', id:'stuff', image:'IT'},
        {name: 'Простои оборудования', id:'downtimes', image:'IT'},
        {name: 'Списание на выработку', id:'writeoff', image:'IT'}
      ]
      return items
    }
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