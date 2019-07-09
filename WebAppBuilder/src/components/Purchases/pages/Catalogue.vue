<template>
    <div v-if="!isCard">
      <v-navigation-drawer fixed right app v-model="filterDrawer" >
        <v-layout class="filter-panel">
          <v-flex>
            <label v-text="'Быстрые фильтры:'" />
            <v-text-field
              v-model="search"
              label="Наименование"
              clearable
              prepend-icon="search"
            />
          </v-flex>
        </v-layout>
      </v-navigation-drawer>
        <v-layout row>
          <catalogue-route-breadcrumbs :code="routeParamCode" />
          <v-layout justify-end>
            <v-btn icon @click="rowViewType = !rowViewType"><v-icon>{{rowViewType ? 'view_agenda' : 'view_column'}}</v-icon></v-btn>
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
        <v-layout wrap justify-center :class="`${rowViewType ? 'row' : 'column'}`">
          <template v-for="item in itemsComp">
            <v-flex :key="item.id" xs12 sm6 md4 lg3 catalogue-card>
              <router-link :to="{ name:'CATALOGUE', params: {catalogueId: item.id.trim() }}">
                <v-card>
                  <item-picture :entityName="entityType" :id="item.id" height="200px" width="200px"/>
                  <span>
                    {{item.name}}
                  </span>
                </v-card>
              </router-link>
            </v-flex>
          </template>
        </v-layout>
        </div>
    </div>
    <div v-else>
      <v-card>
        <v-card-title>
          <catalogue-item :catalogueId="routeParamCode" />
        </v-card-title>
      </v-card>
    </div>
</template>

<script>
  import {PurchasesApi} from "../api/purchasesApi";
  const api = new PurchasesApi();
  export default {
      name: "catalogue",
      data:()=>({
          loading: false,
          items: [],
          search: null,
          timeout: 0,
          entityType: "",
          filterDrawer: false,
          rowViewType: false,
          search: "",
      }),
      props:{
        catalogueId: undefined
      },
      methods:{
        getItems(id){
          var fieldname = "name";
          if (!id){
            id = null;
          }
          if (!id){
            id = null;
          }
          if (id === null && id.trim().length != 15)
          { 
            this.entityType = "resourcesGrops";
          }
          else 
          {
            this.entityType = "resources"; 
            fieldname = "fullName";
          }
          api.getResourcesGroups(id, `id,name: ${fieldname}`).then(this.respCallback);
        },
        respCallback (resp) {
            this.items = resp.data.purchases.items;
        },
        searchCallback (item) { 
          //debugger;
          var itemToSearch = _.lowerCase(item.name);
          var searchedText = _.lowerCase(_.trim(this.search));
          var ret = itemToSearch.indexOf(searchedText);
          return ret >= 0;
        }
      },
      created: function () {
        var id = this.routeParamCode;
        this.items = [];
        this.getItems(id);
      },
      computed:{
        itemsComp(){
          if (this.search === ""){
            return this.items;
          }
          return _.filter(this.items, this.searchCallback);
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
  .v-card {
    text-align: -webkit-center;
    height: 250px;
    margin: 5px !important;
    box-shadow: none;
  }
  a{
    text-decoration: none;
  }
  .filter-panel{
    margin: 10px;
  }
</style>