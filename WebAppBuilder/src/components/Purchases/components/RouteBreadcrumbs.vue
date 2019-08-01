<template>
    <v-layout row wrap="">
            <v-breadcrumbs v-if="show">
                <router-link :to="{ name:'CATALOGUE', params: {catalogueId: null }}">
                      <p>...</p>
                </router-link>
            </v-breadcrumbs>
        <v-flex>
            <v-breadcrumbs :items="breadCrumbs" divider=">">
                <template v-slot:item="props">
                    <router-link :to="{ name:'CATALOGUE', params: {catalogueId: props.item.id.trim(), }}">
                      {{ props.item.text.toUpperCase() }}
                    </router-link>
                </template>
            </v-breadcrumbs>
        </v-flex>
    </v-layout>
</template>

<script>
import {PurchasesApi} from "../api/purchasesApi";
const api = new PurchasesApi();
export default {
    name: "catalogue-route-breadcrumbs",
    props:{
    },
    data:() =>({
        first: {},
        breadCrumbs: [],
        show: true
    }),
    methods:{
        responceCallback(response){
            debugger;
            this.breadCrumbs = response.data.purchases.resourcesGroupsBreadcrumbs;
        },
        getBaseURL() {
            var the_arr = this.$route.fullPath.split('/');
            the_arr.pop();
            return( the_arr.join('/') );
        },
        sethrefs(){
            debugger;
            this.breadCrumbs.forEach(element => {
                element.href = this.getBaseURL()+"/"+element.id;
            });
        }
    },
    created(){
        let currentGroup = this.$route.params.catalogueId;
        if(currentGroup != undefined){
                api.getBreadcrumbsByGroup(currentGroup).then(this.responceCallback);
            }
    },
    watch: {
        '$route' (to, from) {
            debugger;
            if(to.params.catalogueId != null){
                this.show = true;
                api.getBreadcrumbsByGroup(to.params.catalogueId).then(this.responceCallback);
            }
            else{            
                this.show = false;
                this.breadCrumbs = [];
            }
        }
    }
}
</script>

<style scoped>
    .first{
        font-size: larger;
    }
</style>
