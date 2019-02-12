<template>
  <v-content>
     <v-toolbar scroll-off-screen 
         fixed  dark :color="errorStatus ? 'error' :'none-error'">
      <v-toolbar-title class="white--text" >{{header}}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <div id="core-view">
      <v-fade-transition mode="out-in">
        <Dashboard/>
      </v-fade-transition>
    </div>
    <!-- <core-footer v-if="$route.name !== 'Maps'" /> -->
  </v-content>
</template>

<script>
import Dashboard from '../views/Dashboard.vue'
import moment from 'moment'
export default {
  components:{
    Dashboard:Dashboard
  },
  data(){
    return{
      header:'Сводка здоровья проекта за '+ moment().format('DD.MM.YYYY'),
    }
  },
  metaInfo () {
    return {
      title: 'Сводка здоровья проекта',
    }
  },
  computed:{
    errorStatus(){
      return this.$store.getters.getErrorToday
    }
  }
}
</script>

<style scoped>
#core-view {
  padding-bottom: 100px;
}
.none-error{
  background-color: #008FFB !important;
}
.error{
  background-color: #FF4560 !important;
}
</style>
