<template>
    <div>
        <v-breadcrumbs v-if="show" :items="breadCrumbs" divider=">">
            <template v-slot:item="props">
                <router-link :to="{ name:'CATALOGUE', params: {catalogueId: props.item.id.trim() }}">
                    {{ props.item.text }}
                </router-link>
            </template>
        </v-breadcrumbs>
    </div>
</template>

<script>
import {PurchasesApi} from "../api/purchasesApi";
const api = new PurchasesApi();
export default {
    name: "catalogue-route-breadcrumbs",
    props:{
        code:{
            type: String,
            required: true
        }
    },
    data:() =>({
        breadCrumbs: [],
        show: true
    }),
    methods:{
        responceCallback(response){
            this.breadCrumbs = response.data.purchases.resourcesGroupsBreadcrumbs;
            this.breadCrumbs.splice(0,0,{text:"...", id:"", disabled:false});
        },
        getBaseURL() {
            var the_arr = this.$route.fullPath.split('/');
            the_arr.pop();
            return( the_arr.join('/') );
        }
    },
    created(){
        let currentGroup = this.$route.params.catalogueId;
        this.breadCrumbs = []
        if(currentGroup != undefined){
                api.getBreadcrumbsByGroup(this.code).then(this.responceCallback);
            }

        
    },
    watch: {
        '$route' (to, from) {
            if(this.code != ""){
                this.breadCrumbs.shift();
                api.getBreadcrumbsByGroup(this.code).then(this.responceCallback);
            }

            this.breadCrumbs = []
        }
    }
}
</script>