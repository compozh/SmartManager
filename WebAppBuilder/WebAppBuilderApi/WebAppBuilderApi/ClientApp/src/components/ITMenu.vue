<template>
    
    <div v-if="menu" class="menu-container">
        <VueLogo class="all-svg"/>
        <div class="menu-list" >
            <v-treeview 
                :items="ItemsMenu"
                item-key="codeMenu"
                activatable
                open-on-click
                hoverable
                indeterminate-icon
                transition
                class="menu"
            >
            <template slot="label" slot-scope="{ item }" >
                <span v-if="!item.isFolder">
                    <router-link class="none-link" :to="{ name : 'MODULECONTENT', params : LoadModuleContent(item) }">
                        <svg class="svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#'+item.image"></use></svg>
                        {{ item.name }} 
                    </router-link>
                </span>
                <span v-if="item.isFolder">
                    <svg class="svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#'+item.image"></use></svg>
                    {{ item.name }} 
                </span>
            </template>
            </v-treeview>
        </div>
        <div  class="menu-content">
           <router-view name="module">
           </router-view>
        </div>
    </div>

</template>

<script>
import axios from "axios";  
import VueLogo from '../svgfiles/ItIcons.svg';
import getImae from "./Functions/ITMenuFunctions/ConvetImage.js"

export default {
    name:"it-menu",
    components: {
    VueLogo,
  },
    props: ["menu"],
    data(){
        return{
            icons:VueLogo
        }
    },
    computed:{
        ItemsMenu(){
            if(!this.SvgCollection.length){
                return []
            }
            for(var object of this.menu.items){
                if(!object.children){
                    object.children = [];
                }
                if(!object.image==""){
                    object.image = object.image.toUpperCase();
                }else{
                    object.image = "IT";
                }
                var inspaction="";
                for(var child of object.children){
                    if(!child)
                    {
                        break;
                    }
                    
                    child.image = getImae(child.image,this.SvgCollection)
                }
            }
            return this.menu.items;
        },
        SvgCollection(){
            return this.$store.getters.getExistedIcons
        }
    },
    methods:{
        LoadModuleContent(item){
            return { module : item.codeMenu }
        },
        LoadIcons(){
            var icon;
            return icon
        }
    },
    updated(){
        if(this.$store.getters.getExistedIcons.length==0){
            var arr = Array.from(document.getElementsByClassName("all-svg")[0].children).map(r=>r.id);
            this.$store.commit("setExistedIcons", arr)
        }
    }
}
</script>

<style scoped>
    .menu-container{
        display: flex;
        width: 100%;
    }
    .menu{
        text-align: left;
    }
    .menu-list{
        width: 45%;
    }
    .menu-content{
        display: block;
        float: left;
        width: 45%;
    }
    .none-link{
        color: black;
        text-decoration: none !important;
    }
    .svg{
        width: 20px;
        height: 20px;
    }
</style>
