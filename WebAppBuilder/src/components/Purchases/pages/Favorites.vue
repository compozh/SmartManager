<template>
<div v-if="favlists">
  
    <v-container
      v-for="favList in favlists"
      :key="favList.listId"
      fluid
      grid-list-md
      grey
      lighten-4
    >
      <onefavlist :listId= "favList.id" :isEditable="true" :printCount="4"/>
    </v-container>
    <div>
      <v-btn @click="mutationCreateFavList" color="green" dark large fixed bottom right fab>
          <v-icon>add</v-icon>
        </v-btn>
    </div>
    </div>
</template>

<script>

import {PurchasesApi} from "../api/purchasesApi";

const api = new PurchasesApi();


  export default {
     name: "mylist",
    data: () => ({
    }),
    created() {
      api.getFavLists();
      api.getApplications();
    },
    mounted(){
    },
    computed:{
      applications:{
         get: function() {
          return this.$store.getters["purchases/getApplications"];
        },
        set: function(newVal){
          this.$store.commit('purchases/setApplications', newVal);
        }
      },
      favlists: {
        get: function() {
          return this.$store.getters["purchases/getFavLists"];
        },
        set: function(newVal){
          this.$store.commit('purchases/setFavLists', newVal);
        }
      },
    },
    methods: {
      getImage () {
        const min = 530
        const max = 560

        return Math.floor(Math.random() * (max - min + 1)) + min
      },
      ondrag(){},
      mutationDeleteFavList(favList){
        
        api.mutationDeleteFavList(favList);
        this.favlists = this.favlists.filter(w=>w.id != favList.id);
      },
      mutationDeleteItemFromFav(favList, keyValue){
        favList.keyValues = favList.keyValues.filter(w=>w != keyValue);
        api.mutationEditFavList(favList);
      },
      mutationEditFavList(favList){
        
        if(favList.isDefaultList)
        {
          let newList = this.favlists;
          newList.filter(w=>w.alias == favList.alias && w.id != favList.id).forEach(w => w.isDefaultList = false);
          this.favlists = newList;
        }

        api.mutationEditFavList(favList);
      },
      mutationCreateFavList(){
        api.mutationCreateFavList()
      },
      getAplicationByKeyValue(keyValue){
        //this._props.applications = [];
        let apls = this.applications;
        if(apls!= null){
           return apls.find(w => w.id.toString() == keyValue);
        }
       return {};
      },
    }
  }
</script>
