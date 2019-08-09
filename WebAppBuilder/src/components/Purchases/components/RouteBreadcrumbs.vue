<template>
    <v-layout class="wrap" v-if="show" row wrap="">
            <v-breadcrumbs divider=">">
                <router-link class="crumbs" :to="{ name:'CATALOGUE', params: {catalogueId: null }}">
                    ...
                </router-link>
            </v-breadcrumbs>
        <v-flex>
            <v-breadcrumbs :items="breadCrumbs" divider=">">
                <template v-slot:item="props">
                    <router-link class="crumbs" :to="{ name:'CATALOGUE', params: {catalogueId: props.item.id.trim(), }}">
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
                api.getBreadcrumbsByGroup(to.params.catalogueId,false);
            }
            else{
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
