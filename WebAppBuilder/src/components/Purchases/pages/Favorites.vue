<template>
<div>
 
    <v-container
      v-for="favList in favlists"
      :key="favList.id"
      
      grid-list-md
      grey
      lighten-4
    >
    <div v-if="favList">
      <onefavlist :listId="favList.id" :isEditable="true" > </onefavlist>
    </div>
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
    },
    async mounted(){
      if(!this.favlists ){
        await api.getFavLists();
      }
      
      let ress = this.$store.state.purchases.favResources;
      if(!(ress && ress.some(w=>1==1))){
          let favres =  this.favlists.filter(w => w.alias == 'KSM').map(w => w.keyValues).
          reduce((prev, next) => { return prev.concat(next); }, []);
          api.getResourcesByIds(favres);
      }
      let apps = this.$store.getters["purchases/getApplications"];
      
      if(!(apps && apps.some(w=>1==1))){
        let favapps =  this.favlists.filter(w => w.alias == 'DOC').map(w => w.keyValues).
        reduce((prev, next) => { return prev.concat(next); }, []);
        api.getApplicationsByIds(favapps);
      }
     
    },
    computed:{
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
      mutationCreateFavList()
      {
        api.mutationCreateFavList();
      },
    }
  }
</script>
