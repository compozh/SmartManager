<template>
  <div>
    <div v-if="!isCard">
      <v-navigation-drawer fixed right app v-model="filterDrawer" >
        <v-layout class="filter-panel">
          <v-flex>
            <label v-text="$t('purchases.Catalog.FastFilter')" />
            <v-text-field
              v-model="search"
              :label="$t('purchases.Catalog.Name')"
              clearable
              prepend-icon="search"
            />
          </v-flex>
        </v-layout>
      </v-navigation-drawer>
        <v-layout row>
          <catalogue-route-breadcrumbs :code="routeParamCode" />
          <v-layout justify-end>
            <!--<v-btn icon @click="rowViewType = !rowViewType"><v-icon>{{rowViewType ? 'view_agenda' : 'view_column'}}</v-icon></v-btn>-->
            <v-btn icon @click="filterDrawer = !filterDrawer"><v-icon>filter_list</v-icon></v-btn>
          </v-layout>
        </v-layout>
        <div v-if="loading" class="text-xs-center">
          <v-progress-circular
            indeterminate
            color="primary"
          />
        </div>
        <div v-else>
        <v-layout wrap :class="`${rowViewType ? 'row' : 'column'}`">
          <template v-for="item in groups_items">
            <v-flex :key="item.id" xs12 sm6 md4 lg3 catalogue-card>
              <v-card>
                <router-link :to="{ name:'CATALOGUE', params: {catalogueId: item.id.trim() }}">
                  <item-picture :entityName="entityType" :id="item.id" height="200px" width="350px" />
                  <div class="cat_header title mb-1">{{item.name}}</div>                  
                </router-link>
              <v-list>
                <template  v-for="child in item.children.slice(0,5)">
                  <router-link :key="child.id" :to="{ name:'CATALOGUE', params: {catalogueId: child.id.trim() }}">              
                    <v-list-tile class="list_content">                        
                      <v-list-tile-content>
                        <v-list-tile-title v-text="child.name"></v-list-tile-title>                      
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-icon>keyboard_arrow_right</v-icon>
                      </v-list-tile-action>                    
                    </v-list-tile>
                  </router-link>
                </template>
              </v-list>
              </v-card>
            </v-flex>
          </template>
          <template v-for="item in resource_items">
            <v-flex :key="item.id" xs12 sm6 md4 lg3 catalogue-card>
              <!--<resource-card-item :key="item.id" :resourse="item" />-->
              <v-card>
                <router-link :to="{ name:'CATALOGUE', params: {catalogueId: item.id.trim() }}">
                  <item-picture entityName="resources" :id="item.id" height="200px" width="350px" />
                  <div class="cat_header title mb-1">{{item.name}}</div>
                </router-link>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
        </div>
      
      <loader-element/>
    </div>          
    <div v-else>
      <catalogue-item :catalogueId="routeParamCode" />
      <!--<v-card>
        <v-card-title>
          <catalogue-item :catalogueId="routeParamCode" />
        </v-card-title>
      </v-card>-->
    </div>
  </div>
</template>

<script>
  import {PurchasesApi} from "../api/purchasesApi";
  const api = new PurchasesApi();
  export default {
      name: "catalogue",
      data:()=>({
          loading: false,
          search: null,
          timeout: 0,
          entityType: "",
          filterDrawer: false,
          rowViewType: true,
          search: "",
      }),
      props:{
        catalogueId: undefined
      },
      methods:{
        getItems(id){
          var fieldname = "name";
          if (!id){
            id = "";
            api.getResourcesGroupsByParentGroup(id);
          }
          else{
            api.getResourcesGroupById(id);
          }
        },
        
        searchCallback (item) {
          var itemToSearch = _.lowerCase(item.name);
          var searchedText = _.lowerCase(_.trim(this.search));
          var ret = itemToSearch.indexOf(searchedText);
          return ret >= 0;
        },
      },
      created: function () {
        var id = this.routeParamCode;
        this.getItems(id);
      },
      computed:{
        groups_items: {
          get: function() {
            if (this.search === ""){                        
              
              return this.$store.getters["purchases/getResourceGroups"];
            }
          
          return _.filter(this.$store.getters["purchases/getResourceGroups"], this.searchCallback);
          }
        },
        resource_items: {
          get: function() {
            if (this.search === ""){                     
              let test = this.$store.getters["purchases/getResources"];

              return this.$store.getters["purchases/getResources"];
            }

          return this.$store.getters["purchases/getResources"];//_.filter(this.$store.getters["purchases/getResources"], this.searchCallback);
          }
        },
        test_items:{
          get: function() {
            if (this.search === ""){
              return this.$store.getters["purchases/getTestItems"];
            }
          
          let tt = this.$store.getters["purchases/getTestItems"];
          return _.filter(this.$store.getters["purchases/getTestItems"], this.searchCallback);
          }
        },

        routeParamCode(){
          return this.$route.params.catalogueId ? this.$route.params.catalogueId : "";
        },
        isCard(){
          var isCard = _.trim(this.routeParamCode).length === 15;
          return isCard;
        }
      },
      watch: {
        '$route' (to, from) {
          var id = to.params.catalogueId;
          this.getItems(id);
        }
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