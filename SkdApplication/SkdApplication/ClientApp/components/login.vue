<template>

 <v-app class="formlogin">


<v-container grid-list-md text-xs-center class="containerlogin">
  <v-layout row wrap>
    <v-flex xs4>
      <v-card></v-card>
    </v-flex>
    <v-flex xs4>
      <v-card >
        <v-text-field
          v-model="datauser.login"
          v:rules="[rules.email]"
          box
          color="deep-purple"
          label="Email address"
          type="email">
        </v-text-field>
      </v-card>
    </v-flex>
      <v-flex xs4>
        <v-card></v-card>
      </v-flex>
      <v-flex xs4>
        <v-card></v-card>
      </v-flex>
      <v-flex xs4>
        <v-card >
          <v-text-field  v-model="datauser.password" v:rules="[rules.password, rules.length(6)]" 
              box color="deep-purple" counter="20" label="Password" style="max-height: 60px;" :type="show_password">
          </v-text-field>
          <v-switch class="checklog" :label="'Показать пароль'" v-model="choice">
          </v-switch>
        </v-card>
      </v-flex>
      <v-flex xs4>
        <v-card ></v-card>
      </v-flex>
      <v-flex xs4>
        <v-card></v-card>
      </v-flex>
      <v-flex xs4>
          <v-flex xs4></v-flex>
          <v-btn color="success" v-on:click="SigIn">login</v-btn>
          <v-btn color="primary">forgot</v-btn>
      </v-flex>
      <v-flex xs4>
        <v-card ></v-card>
      </v-flex>
        
      <v-flex xs4>
          <v-card></v-card>
      </v-flex>
      <v-flex xs4>
        <v-flex xs4></v-flex>
        <h1 class="inspection">{{inspection}}</h1>
      </v-flex>
      <v-flex xs4>
        <v-card >
        </v-card>
      </v-flex>
  </v-layout>
</v-container>
    <!-- <router-link to="/users"><v-btn :click="SigIn"> go to users</v-btn></router-link> -->
    
  </v-app>
</template>

<script>

import Axios from "axios"

// import {mapGetters, mapActions} from 'vuex'
export default {
  data () {
    return {
        datauser:{
          login:'BAHAREV@IT-ENTERPRISE.COM',
          password:'dca5ac',
        },
        inspection:"",
        show_password:"password",
        choice:false,
    }
  },
  computed: {
      user(){
        return this.$store.getters.getUser;//getters из vuex папка (store/index.js)
      },
      users_list(){
        return this.$store.getters.getUsersList;//getters из vuex папка (store/index.js)
      }
  },
  watch:{
      user: function(){
      if(this.user.success==true)
         {
           if(this.users_list==''){//если список пользователей пуст то загружаем
            this.$store.dispatch('actionLoadUsersList')//загружаем фейсы(пользователей) через Action(actionLoadUsersList)---> (store/index.js) 
            this.$router.push('users')
            }
            else{//иначе просто переходим
            this.$router.push('users')
            }
            console.log('true')

         }
      else if(this.user=="wrong"){
            this.inspection="не правильный логин или пароль"
            console.log('false')
      }
    },
    choice:function(){
      if(!this.choice)
        this.show_password='password'
      else
        this.show_password=''
    }
  },
  methods:{
      // ...mapActions(['actionLoadUser']) , а это другйо способ как пользвоатсья экшинами
    SigIn:function(){
          this.$store.dispatch('actionLoadUser',this.datauser)//загружаем фейсы(пользователей) через Action(actionLoadUser)---> (store/index.js) 
          // this.actionLoadUser(this.datauser);
    },
  }
}
</script>

<style scoped>
.inspection{
  color: #E53935;
}
.formlogin{
  position: relative;
  top: 25%;
}
.containerlogin{
  background-color: white
}
.checklog{
  position: relative;
  left: 15px; 
}
</style>

