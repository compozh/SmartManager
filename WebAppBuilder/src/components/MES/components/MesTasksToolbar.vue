<template>
  <v-layout row xs12>
    <v-flex
      class="toolbar-basebuttons"
      grow
      v-if="layout !== 'mes-task-setup-materials-layout'">
      <v-btn
      outlined @click="onclickSetupMaterial($event)">Установить материалы</v-btn>
      <v-btn
      outlined :color="this.applyWorkColor" @click="onclickAccept($event)">Взять в работу</v-btn>
    </v-flex>
    <v-flex
    grow
    v-if="layout === 'mes-task-setup-materials-layout'">
      <v-text-field
        class="qr-input"
        v-model="firstname"
        :rules="nameRules"
        :counter="10"
        label="Укажите QR-партии материала для установки"
        required
      ></v-text-field>
    </v-flex>
   <v-flex
   xs2
   v-if="layout !== 'mes-task-setup-materials-layout'">
      <v-btn
      outlined color="error" @click="onclickDowntime($event)">Простой</v-btn>
   </v-flex>
   <v-flex
   xs2
   v-if="layout === 'mes-task-setup-materials-layout'">
     <v-btn
     outlined @click="onclickDowntime($event)">Снять все партии</v-btn>
   </v-flex>
  </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-tasks-toolbar",
  data(){
    return {applyWorkColor: 'success'}
  },
 props: {
    layout: String
  },
  methods:{
    onclickSetupMaterial: function(event) {
      this.$emit('layout', 'mes-task-setup-materials-layout');
    },
    onclickAccept: function(event, state) {
        let target = event.target;
        debugger;
        if(!target.state || target.state === "accept") {
          debugger;
          this.applyWorkColor = 'error';
          target.textContent = "Остановить";
          target.state = "suspend";
        } else {
          this.applyWorkColor = 'success';
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
  .toolbar-basebuttons{
    display: flex;
    justify-content: flex-start;
    padding-left: 25px;
  }
  .qr-input{
    padding-left: 25px;
    width: 500px;
  }
</style>
