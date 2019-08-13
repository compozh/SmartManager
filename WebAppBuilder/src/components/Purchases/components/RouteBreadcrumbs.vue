<template>
    <v-layout  class="wrap" v-if="show" row wrap>
        <v-breadcrumbs v-if="$vuetify.breakpoint.mdAndUp || breadCrumbs.length==1" divider=">">
            <router-link class="crumbs" :to="{ name:'CATALOGUE', params: {catalogueId: null }}">
                ...
            </router-link>
        </v-breadcrumbs>
        <v-flex>
            <v-breadcrumbs v-if="$vuetify.breakpoint.mdAndUp" :items="breadCrumbs" divider=">">
                <template v-slot:item="props">
                    <router-link class="crumbs" :to="{ name:'CATALOGUE', params: {catalogueId: props.item.id.trim() }}">
                      {{ props.item.text }}
                    </router-link>
                </template>
            </v-breadcrumbs>     
            <v-breadcrumbs v-else :items="this.currentId.length==15 ? [breadCrumbs[breadCrumbs.length-1]]: [breadCrumbs[breadCrumbs.length-2]]">
                <template v-slot:item="props">
                    <router-link class="crumbs" :to="{ name:'CATALOGUE', params: {catalogueId: props.item.id.trim() }}">
                      {{ props.item.text }}
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
        currentId: new String(),
        mobileRoute: function(){
            let result = [];
            let item = {};
            if(currentId.length == 15){
                item = breadCrumbs[breadCrumbs.length-1];
                result.push(item);
            }else{
                item = breadCrumbs[breadCrumbs.length-2];
                result.push(item);
            }

            return result;
        },
        first: {}
    }),
    created(){
        this.$store.state.purchases.breadcrumbs = [];
        let currentGroup = this.$route.params.catalogueId;
        if(currentGroup != undefined){
            api.getBreadcrumbsByGroup(currentGroup,false);
        }
    },
    computed:{
        show:{
            get: function() {
                if(this.$store.getters["purchases/getBreadCrumbs"].length === 0){
                    return false;
                }
                
                return true;
            },
        },
        breadCrumbs:{
            get: function() {
                return this.$store.getters["purchases/getBreadCrumbs"];
            },
        }
    },
    watch: {
        '$route' (to, from){
            if(to.params.catalogueId != null){
                this.currentId = to.params.catalogueId;
                api.getBreadcrumbsByGroup(to.params.catalogueId,false);
            }
            else{
                this.currentId = new String();
                this.$store.state.purchases.breadcrumbs = [];
            }
        }
    }
}
</script>

<style scoped>
    .first{
        font-size: 10.2em;
    }

    .crumbs{
        font-size: 1em;
        color: grey;
    }
    .wrap{
        position: absolute;
    }
</style>
