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
      <v-flex>
        <v-layout justify-end>
          <v-btn icon @click="rowViewType = !rowViewType"><v-icon>{{rowViewType ? 'view_agenda' : 'view_column'}}</v-icon></v-btn>
          <v-btn icon @click="filterDrawer = !filterDrawer"><v-icon>filter_list</v-icon></v-btn>
        </v-layout>
      </v-flex>
      <v-flex>
      <v-layout wrap justify-center>
        <template v-for="(item, i) in itemsComp">
          <v-flex :key="i" xs12 sm6 md4 lg3 catalogue-card>
            <router-link :to="{ name:`${ entityType === 'resourcesGrops' ? 'CATALOGUEIN' : 'CATALOGUEITEM'}`, params: {catalogueId: item.id}}">
              <v-card class="item-card">
                <item-picture :entityName="entityType" :id="item.id" />
                <span>
                  {{item.name}}
                </span>
              </v-card>
            </router-link>
          </v-flex>
        </template>
      </v-layout>
      </v-flex>
  </div>
  <div v-else>
    <v-card>
      <v-card-title>
        {{catalogueId}}
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
          search: ""
      }),
      props:{
        catalogueId: undefined
      },
      methods:{
        getResourcesGroups(group){
          this.entityType = "resourcesGrops";
          this.callAxiosQuery(group ? group : "")
        },
        getResources(group){
          this.entityType = "resources";
          this.callAxiosQuery(group,"fullName");
        },
        callAxiosQuery(group, nameField) {
          const query = `
          {
            purchases{
              items: ${this.entityType} (group: "${group}") {
                id,
                name: ${nameField ? nameField : "name"}
              }
            }
          }
          `;
          purchasesSchemaAxios(this, query).then(this.respCallback);
        },
        respCallback (resp) {
            this.items = resp.data.data.purchases.items;
        }
      },
      created: function () {
        this.getResourcesGroups(this.$route.params.catalogueId);
      },
      computed:{
        itemsComp(){
          if (this.search === ""){
            return this.items;
          }
          return _.filter(this.items, function(item){ return _.lowerCase(item.Name).indexOf(this.search) > 0 });
        },
        isCard(){
          return _.trim(this.$route.params.catalogueId).length === 15
        }
      },
      watch: {
        '$route' (to, from) {
          debugger;
          var groupItem = _.find(this.items,["id",to.params.catalogueId]);
          this.getResourcesGroups(to.params.catalogueId);
        },
        items (to, prev) {
          if (to.length === 0 && this.entityType != "resources"){
            this.getResources(this.$route.params.catalogueId);
          }
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