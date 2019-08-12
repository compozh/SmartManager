<template>
    <div v-if="favList">
        <v-container
            :key="favList.id"
            fluid
            grid-list-md
            grey
            lighten-4
            >
            <v-layout v-if="isEditable">
                
                <v-flex xs12 sm6 md3>
                <textbox :item="favList" field="caption" :change="mutationEditFavList"/>
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
             <draggable  v-model="favLists"  v-bind="{group: favList.alias, sort:false, disabled: false}">
            <v-layout row wrap>

              <v-flex
                  v-for="card in favList.items"
                  :key="card.id"
                  xs12
                  sm6
                  md4
                  >
                   <draggable v-model="card.itSelfArray"  :move="onmove" @end="end" v-bind="{group: favList.alias, sort:false}"  style="min-height: 10px">
                    <div :key="card.id" v-if="favList.alias === 'DOC'" >
                      <applicationCard  :index="card.id" :application="card" />
                    </div>
                    <div :key="card.id.toString()" v-else>
                      <catalogueItemCard :catalogueItem="card" />
                    </div>
                    
              </draggable>
            </v-flex>
            <div v-if="!favList.items.some(w => 1==1)" class="emptyBlock" >
            </div>
            </v-layout>
          </draggable >
      </v-container>
      
    </div>
    
</template>


<script>

import {PurchasesApi} from "../api/purchasesApi";
import _ from 'lodash';
import draggable from 'vuedraggable';

const api = new PurchasesApi();


  export default {
     name: "onefavlist",
     components: {
      draggable,
      
     },
     props:{
        listId: {
            type: String,
            required: false
        },
        printCount: {
            type: Number,
            required: false
        },
        isEditable: {
            type: Boolean,
            required: false
        },
        catalogueItem:{},
        
    },
    data: () => ({
        favListt:undefined,
        listToAdd:undefined,
        listToRemove:undefined,
        itemToMove : undefined,
        saveVisible:false
    }),
    created: function () {
       api.getFavLists();
      },
    destroyed(){
      this.$store.state.resources = [];
    },
    beforeDestroy(){
      this.$store.state.resources = [];
    },
    computed:{
      dragOptions(){
          return {
         animation: 1,
        group: 'fd',
        ghostClass: "2",
        disabled: false,
        sort: false
        };
      },
      applications:{
         get: function() {
          return this.$store.getters["purchases/getApplications"];
        },
        set: function(newVal){
          this.$store.commit('purchases/setApplications', newVal);
        }
      },
      resource_items: {
          get: function() {
            return this.$store.state.purchases.favResources;
          }
        },
      favList: {
        get: function() {
           if(this.listId){
            let list = this.allFavLists.filter(w => w.id == this.listId)[0];
            list.items = [];
            
            list.keyValues.forEach(w => {
              
              let test = list.alias =='DOC' ? this.getAplicationByKeyValue(w) : this.getСatalogueItemByKeyValue(w);
              if(test)
              {
                test.itSelfArray = [test];
                list.items.push(test);
              }
            });
            return list;
          }
          return undefined;
        },
        set:function() {
        }
      },
      favLists: {
        get: function() {
             return [this.favList]
             }
      },
      allFavLists: {
        get: function() {
          let test = this.$store.getters["purchases/getFavLists"];
            return test;
        },
        set: function(newVal){
          this.$store.commit('purchases/setFavLists', newVal);
        }
      }
    },
    methods: {
    getFavListsById(id){
        let test = this.allFavLists.filter(w=>w.id == id);
        if(test == undefined){
        }
        return test;
    },  
    onmove({ relatedContext, draggedContext }){
     
      let listToAdd = relatedContext.element;
      let itemToMove2 = draggedContext.element;

      if(itemToMove2 != undefined && listToAdd != undefined)
      {
        let listToRemove = this.allFavLists.find(w => w.keyValues.some(x => x == itemToMove2.id.toString()));
        
        this.listToAdd = listToAdd;
        this.listToRemove = listToRemove;
        this.itemToMove = itemToMove2;  
      }
      return false;
      },
      end(){
        api.mutationChangeListForItem(this.itemToMove.id.toString(), this.listToAdd.id.toString(), this.listToRemove.id.toString());
        let listToRemove = this.allFavLists.find(w=>w.id.toString() == this.listToRemove.id.toString());
        let listToAdd = this.allFavLists.find(w=>w.id.toString() == this.listToAdd.id.toString());
        
        listToRemove.keyValues = listToRemove.keyValues.filter(w => w != this.itemToMove.id.toString());
        listToAdd.keyValues.push(this.itemToMove.id.toString());

        this.listToRemove = undefined;
        this.listToAdd = undefined;
        this.itemToMove = undefined;
      },
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
          newLists.filter(w => w.alias == favList.alias && w.id != favList.id).forEach(w => w.isDefaultList = false);
          this.allFavLists = newLists;
        }
        api.mutationEditFavList(favList);
      },
      mutationCreateFavList(){
        api.mutationCreateFavList();
      },
      getAplicationByKeyValue(keyValue){
        let apls = this.applications;
        if(apls!= null){
           return apls.find(w => w.id.toString() == keyValue);
        }
       return {};
      },
      getСatalogueItemByKeyValue(keyValue){
        let test2 = 2;
        
        test2 =  this.resource_items.find(w => w.id == keyValue);
        return test2;
      },
    }
  }
</script>

<style scoped>

.emptyBlock{
  min-height: 50px;
}

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