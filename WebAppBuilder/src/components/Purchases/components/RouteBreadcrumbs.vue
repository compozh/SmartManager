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

            debugger;
            
            this.breadCrumbs.splice(0,0,{text:"...", id:" ", disabled:false});

            debugger;
        }
    },
    created(){
        let currentGroup = this.$route.params.catalogueId;
        api.getBreadcrumbsByGroup(currentGroup).then(this.responceCallback);
    },
    watch: {
        '$route' (to, from) {
            debugger;
            api.getBreadcrumbsByGroup(this.code).then(this.responceCallback);
        }
    }
}
</script>