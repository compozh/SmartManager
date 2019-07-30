<template>
  <v-layout row>
    <v-flex>
      <v-btn outlined class="setup-material-button" @click="onclickSetupMaterial($event)">Установить материалы</v-btn>
   </v-flex>
   <v-flex>
      <v-btn outlined class="accept-button" @click="onclickAccept($event)">Взять в работу</v-btn>
   </v-flex>
   <v-flex>
      <v-btn outlined class="downtime-button" @click="onclickDowntime($event)">Простой</v-btn>
   </v-flex>
  </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  data: {
  },
  name: "mes-tasks-setupMaterials",
  methods:{
    onclickSetupMaterial: function(event) {


    },
    onclickAccept: function(event, state) {
        let target = event.target;
        debugger;
        if(target.state === "accept") {
          target.textContent = "Остановить";
          target.state = "suspend";
        } else {
          target.state = "accept";
           target.textContent = "Взять в работу";
        }
    },
    onclickDowntime: function(event) {
      

    }
  } 
}
</script>

<style type="text/css" scoped>
.setup-material-button {
  left: 0;  
}
.accept-button {
  
}
.downtime-button {
  right: 0;  
}
</style>
