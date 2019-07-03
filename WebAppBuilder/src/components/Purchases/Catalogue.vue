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
        <v-layout wrap justify-center>
          <template v-for="(item, i) in itemsComp">
            <v-flex :key="i" xs12 sm6 md4 lg3 catalogue-card>
              <router-link :to="{ name:'CATALOGUE', params: {catalogueId: item.id.trim() }}">
                <v-card class="item-card">
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
  import purchasesSchemaAxios from "./BaseFunctions"
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
          if (id !== null && id.trim().length != 15)
          { 
            this.entityType = "resourcesGrops";
          }
          else 
          {
            this.entityType = "resources"; 
            fieldname = "fullName";
          }
          const query = `
          {
            purchases{
              items: ${this.entityType} (group: "${id}") {
                id,
                name: ${fieldname}
              }
            }
          }
          `;
          purchasesSchemaAxios(this, query).then(this.respCallback);
        },
        respCallback (resp) {
            this.items = resp.data.data.purchases.items;
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

<style>
  .item-card{
    text-align: -webkit-center;
    height: 250px;
    margin: 5px !important;
  }
  .catalogue-card a{
    text-decoration: none;

  }
  .filter-panel{
    margin: 10px;
  }
</style>