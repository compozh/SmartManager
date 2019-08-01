<template>
    <div class="app1">
        <v-container
            v-for="favList in favlists"
            :key="favList.id"
            fluid
            grid-list-md
            grey
            lighten-4
            >
            <v-layout v-if="isEditable">
                
                <v-flex xs12 sm6 md3>
                <v-text-field 
                    :label="favList.caption"
                    v-model="favList.caption"
                    solo
                    @input="mutationEditFavList(favList)"
                ></v-text-field>  
                </v-flex>

                <v-flex>
                <v-switch 
                v-model="favList.isDefaultList"
                label="По умолчанию"             
                @change="mutationEditFavList(favList)"/>
                </v-flex >
                <v-flex>
                <v-btn flat small color="error" @click="mutationDeleteFavList(favList)">Delete List</v-btn>
                </v-flex >
            </v-layout>
            <v-layout row wrap>
                <v-flex
                v-for="card in favList.keyValues.slice(0,countToPrint)"
                :key="card"
                xs12
                sm6
                md4
                >
                <applicationCard :application="getAplicationByKeyValue(card)" />
                </v-flex>
                
            </v-layout>
        </v-container>
    </div>
</template>


<script>

import {PurchasesApi} from "../api/purchasesApi";

const api = new PurchasesApi();


  export default {
     name: "onefavlist",
     props:{
        listId: {
            type: String,
            required: true
        },
        printCount: {
            type: Number,
            required: false
        },
        isEditable: {
            type: Boolean,
            required: false
        },
    },
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
            return this.allFavLists.filter(w => w.id == this.listId);
        },
        set: function(newVal){
          this.$store.commit('purchases/setFavLists', newVal);
        }
      },
      allFavLists: {
        get: function() {
            return this.$store.getters["purchases/getFavLists"];
        },
        set: function(newVal){
          this.$store.commit('purchases/setFavLists', newVal);
        }
      },
      countToPrint:{
          get: function() {
            return this.printCount;
        }
      }
    },
    methods: {
      ondrag(){},
      mutationDeleteFavList(favList){
        api.mutationDeleteFavList(favList);
        this.allFavLists = this.allFavLists.filter(w=>w.id != favList.id);
      },
      mutationDeleteItemFromFav(favList, keyValue){
        favList.keyValues = favList.keyValues.filter(w=>w != keyValue);
        api.mutationEditFavList(favList);
      },
      mutationEditFavList(favList){
        if(favList.isDefaultList)
        {
          let newLists = this.allFavLists;
          newLists.filter(w=>w.alias == favList.alias && w.id != favList.id).forEach(w => w.isDefaultList = false);
          this.allFavLists = newLists;
        }
        api.mutationEditFavList(favList);
      },
      mutationCreateFavList(){
        api.mutationCreateFavList()
      },
      getAplicationByKeyValue(keyValue){
        let apls = this.applications;
        if(apls!= null){
           return apls.find(w => w.id.toString() == keyValue);
        }
       return {};
      },
    }
  }
</script>

<style scoped>


.app1{
    padding: 5px;
    margin: 5px;
}
.app1 a{
    text-decoration: none;
}
.app1 .v-card__title {
    font-size: 15px;
    font-weight: 600;
    padding: 5px 15px;
}

.app1 .v-card__text {
    text-align: left;
    margin-left: 10px;
    padding: 5px;
    height: 40px;
}
.app1 .v-card__actions {
    padding: 5px;
}
.app1{
    margin: 0px 0px 5px 0px;
}

</style>