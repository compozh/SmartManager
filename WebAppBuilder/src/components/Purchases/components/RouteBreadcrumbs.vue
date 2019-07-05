<template>
    <div>
        <v-breadcrumbs  v-if="show" :items="cataloguePath">
            <template v-slot:item="props">
                <router-link :to="{ name:'CATALOGUE', params: {catalogueId: props.item.id }}">
                {{ props.item.text }}
                </router-link>
        </template>
        </v-breadcrumbs>
    </div>
</template>

<script>
import purchasesSchemaAxios from "../api/BaseFunctions";
export default {
    name: "catalogue-route-breadcrumbs",
    props:{
        code:{
            type: String,
            required: true
        }
    },
    data:() =>({
        loading: false,
        cataloguePath: [],
        show: false
    }),
    methods:{
        getRoutePath(code) {
            const query = `{purchases{items: resourcesGrops(id: "${code}"){id,name,parent{id}}}}`;
            purchasesSchemaAxios(this, query).then((r) => this.getParendCodeCallback(r));
        },
        getParendCodeCallback(r) { 
            var item = _.first(r.data.data.purchases.items);
            if (item)
            {
                if (!item.parent || item.parent === null){
                    var id = _.trim(item.id);
                    this.cataloguePath.unshift({ text: item.name, disable: false, id: id, href: `${this.getBaseURL(id)}` });
                    this.cataloguePath.unshift({ text: "..."    , disable: false, id: null   , href: `${this.getBaseURL()}` });
                    this.show = true;
                }
                else{
                    var id = _.trim(item.id);
                    this.cataloguePath.unshift({ text: `${item.name}`, disable: id === this.code, id: id, href: `${this.getBaseURL()}\\${id}` });
                    this.getRoutePath(item.parent.id);
                }
            }
        },
        getBaseURL() {
            var the_arr = this.$route.fullPath.split('/');
            the_arr.pop();
            return( the_arr.join('/') );
        }
    },
    created(){
        this.getRoutePath(this.code)
    },
    watch: {
        '$route' (to, from) {
            this.cataloguePath = [];
            this.show = false;
            this.getRoutePath(this.code)
        }
    }
}
</script>