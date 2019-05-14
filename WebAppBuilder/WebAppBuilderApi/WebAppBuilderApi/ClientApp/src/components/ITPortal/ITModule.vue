<template>
<div>
<span>{{Module.title}}</span>
    <v-treeview
        :items="Module.paragraphItem"
        item-key="codeMenu"
        open-on-click
        hoverable
        indeterminate-icon
        transition
        class="menu"
    >
        <template slot="label" slot-scope="{ item }" >
            <span v-if="item.webClientStartParams">
                <a target="_blank" :href="BaseUrl+item.webClientStartParams"> {{ item.name }} </a>
            </span>
            <span v-if="!item.webClientStartParams">
                {{ item.name }}
            </span>
        </template>
    </v-treeview>
    </div>
</template>

<script>
export default {
    name:"it-module",
    computed:{
        Module: function () {
                if( this.$store.getters.getAppData("ITMODULE")){
                    return this.$store.getters.getAppData("ITMODULE").data.itmenu.moduleContent
                } 
                return { paragraphItem : [] }
        },
        BaseUrl(){
            return this.$store.getters.getAppData("ITMENU").data.itmenu.menu.baseUrl + "/?par3=;ITCALL,"
        }
    },
    methods:{
        loadDataForComponents(){
            
            if(this.$route.params.module != "FAVORITE_MODULE" && this.$route.params.module){
                var datasource = {
                    query:' { itmenu { moduleContent(codeMenu:"' + this.$route.params.module + '"){  title tooltip  paragraphItem{ name: text  image codeMenu  isFolder children: nodes{ webClientStartParams name: text image codeMenu isFolder } } } } } ',
                    schema:"ITPORTAL"
                }
                var key = "ITMODULE";
                this.$store.dispatch("LoadDataForComponent", {
                    datasource,
                    key
                });
            }else {
                 this.$store.commit("setAppData", { key: "ITMODULE", data: 
                 {
                     data:{
                         itmenu:{
                             moduleContent:  this.$store.getters.getAppData("ITMENU").data.itmenu.menu.moduleContent} 
                         }
                     }
                 })
                 
            }
        },
        // Функция для обновления данных при изменении роутинга
        beforeRouteUpdate (to, from, next){
            this.loadDataForComponents();
        }
    },
    beforeMount(){
        this.loadDataForComponents();
    },
    
    
}
</script>

<style scoped>
    .menu{
        text-align: left;
    }
</style>
