<template>
<div>
 
    <v-container
      v-for="favList in favlists"
      :key="favList.id"
      
      grid-list-md
      grey
      lighten-4
    >
      <onefavlist :listId="favList.id" :isEditable="true" />
      
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
import draggable from 'vuedraggable';

  export default {
     name: "mylist",
     components: {
      draggable,
     },
    data: () => ({
    }),
    created() {
      
    },
    async mounted(){
      await api.getFavLists();
      let favres =  this.favlists.filter(w => w.alias == 'KSM').map(w => w.keyValues).
        reduce((prev, next) => { return prev.concat(next); }, []);
      api.getResourcesByIds(favres);
      let favapps =  this.favlists.filter(w => w.alias == 'DOC').map(w => w.keyValues).
        reduce((prev, next) => { return prev.concat(next); }, []);
       api.getApplicationsByIds(favapps);
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
      ondrag(){},

      mutationCreateFavList()
      {
        api.mutationCreateFavList()
      },
    }
  }
</script>
