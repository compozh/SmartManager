<template>
  <v-app id="inspire">
    <v-card  >
      <v-navigation-drawer
        v-model="drawer"
        permanent
        fixed        
         >
        <v-toolbar flat class="transparent">
          <v-list class="pa-0">
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img :src="user.photo">
              </v-list-tile-avatar>
  
              <v-list-tile-content>
                <v-list-tile-title class="textname">{{user.userName}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-toolbar>
  
        <v-list class="pt-3" dense>
          <v-divider></v-divider>
  
          <v-list-tile class="list"
            v-for="item in routes"
            :key="item.display" @click="">
            <v-list-tile-action>
             <icon :icon="item.icon" class="mr-2" />
            </v-list-tile-action>
            <v-list-tile-content >
              <router-link  :to="item.path" exact-active-class="active" tag="h1">
              <v-btn flat block ><v-list-tile-title class="texticon"> {{ item.display }}</v-list-tile-title></v-btn>
              </router-link>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </v-app>
</template>


<script>
    import { routes } from '../router/routes'
    export default {
      data () {
        return {
            routes,
            collapsed: true,
            drawer: true,
            right: null,
            floating:true,
            width:5000
        }
      },
      computed: {
      user(){
        return this.$store.getters.getUser;//getters из vuex папка (store/index.js)
      }
      },
      methods: {
        toggleCollapsed: function (event) {
          this.collapsed = !this.collapsed
        }
      }
    }
</script>

<style scoped>
        /* background-color: white; */
    .slide-enter-active, .slide-leave-active {
    transition: max-height .35s
    }
    .slide-enter, .slide-leave-to {
    max-height: 0px;
    }

    .slide-enter-to, .slide-leave {
    max-height: 20em;
    }
    .textname{
        font-size: 12px;
    }
    .mr-2{
        font-size: 30px;
        color: #424242;
        
    }
    .texticon{
        font-size: 20px;
        color: black;
    }
    .list{
        margin: 10px 0px 10px 0px;
    }
</style>
