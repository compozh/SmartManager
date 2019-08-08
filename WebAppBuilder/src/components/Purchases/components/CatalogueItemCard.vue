<template>
<v-flex :key="catalogueItem.id" v-if="catalogueItem" catalogue-card>
    <v-card>
        <router-link :to="{ name:'CATALOGUE', params: {catalogueId: catalogueItem.id.trim() }}">
            <item-picture entityName="resources" :id="catalogueItem.id" height="200px" width="350px" />
            <div class="cat_header title mb-1">{{catalogueItem.name}}</div>
            <v-layout justify-end>
              <add2cart-btn entityType="resource" :keyValue="catalogueItem.id.toString()"/>
              <favorite-btn :v-model="catalogueItem" value="a" alias="KSM" :keyValue="catalogueItem.id.toString()" :isInFavorite="inFavorites(catalogueItem)" />  
            </v-layout>
        </router-link>
    </v-card>
</v-flex>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import {PurchasesApi} from "../api/purchasesApi";

const api = new PurchasesApi();

export default {
    name: "catalogueItemCard",
    props: { 
        //applicationId: 0,
        catalogueItem: {}
    },
      methods:{
        inFavorites: (catalogueItem) => {
             if (catalogueItem) {
                return catalogueItem.favListId != null;
            }
        }
    },
    created(){
        //debugger;

    }
}

</script>

<style lang="scss" scoped>

.cat_header{
  min-height: 40px;
  color: darkslategray;
}
.list_content:hover{
  background: lightgrey;
}
.list_content{
  border-bottom: 1px solid lightgray;
  color: dimgray;
}
  .child{
    float: left;
  }
  .v-card {
    text-align: -webkit-center;
    min-height: 250px;
    margin: 5px !important;
    box-shadow: none;
  }
  a{
    text-decoration: none;
  }
  
  .item-picture{
    max-width: 100%;
  }

  .filter-panel{
    margin: 10px;
  }
</style>