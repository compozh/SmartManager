<template>
  <v-app>
    <v-flex xl12 sm6 md3 >
        <!-- <icon :icon="['fa', 'search']"/> -->
      <v-text-field label="Поиск" color="success">
      </v-text-field>
    </v-flex>
    <div v-for="userCom in users_list" :key="userCom.USERID"> 
      <list-component :userCopmonent='userCom'> <!-- передаю "привязываю" пользовательскому компоненту  данные  -->
      </list-component> 
    </div>
  </v-app>
</template>

<script>
import Axios from "axios"
import LicstComponent from "./listcomponent"
// import lodash from "lodash"
export default {
  components: {
        'list-component': LicstComponent // объявляю пользовательский компонент
    },
    data () {
      return {}
    },
    computed:{
      users_list(){
        return this.$store.getters.getUsersList;//getters из vuex папка (store/index.js)
      },
      user(){
        return this.$store.getters.getUser;//getters из vuex папка (store/index.js)
      }
    },
    created: function () {
    },
    beforeMount: function(){
      //подробно разобрать beforeMount !!!!!!!!!!!!!!!!!!!!!!!!
      if(this.user=='wrong' || this.user==''){ // после рефреш появляется проблема с тем что, приходиться логинется, хотя состояние должно сохраниться
         this.$router.push('login')
      }
    },
    methods: {
      
    } 
}
</script>

<style>
.search{
background: #A5D6A7;
}

</style>
