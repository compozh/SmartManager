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
                <svg class="svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#' + item.image"></use></svg>
                <a  target="_blank" :href="BaseUrl+item.webClientStartParams"> {{ item.name }} </a>
                <!-- <router-link class="none-link" :to="{name: 'ITCLIENT', query:{licnk : BaseUrl + item.webClientStartParams} }"> {{ item.name }} </router-link> -->
            </span>
            <span v-if="!item.webClientStartParams">
                {{ item.name }}
            </span>
        </template>
    </v-treeview>
    </div>
</template>

<script>
import getImae from "./Functions/ITMenuFunctions/ConvetImage.js"
export default {
    name:"it-module",
    computed:{
        Module: function () {
            
            if( this.$store.getters.getAppData("ITMODULE")){
                if(!this.SvgCollection.length){
                    return []
                }
                var list = this.$store.getters.getAppData("ITMODULE").data.itmenu.moduleContent

                for(var object of list.paragraphItem){
                    var inspaction="";
                    object.children = object.children.filter(item => item.webClientStartParams)
                    for( var child of object.children){
                        if(!child)
                        {
                            break;
                        }
                        child.image = getImae(child.image,this.SvgCollection)
                    }
                }
                return list;
            } 
            return { paragraphItem : [] }
        },
        BaseUrl(){
            return this.$store.getters.getAppData("ITMENU").data.itmenu.menu.baseUrl + "/?par3=;ITCALL,"
        },
        SvgCollection(){
            return this.$store.getters.getExistedIcons
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
    .svg{
        width: 20px;
        height: 20px;
    }
</style>
