<template>
    
    <div v-if="menu">
        <div class="menu-content" >
            <v-treeview 
                :items="ItemsMenu"
                item-key="codeMenu"
                open-on-click
                hoverable
                indeterminate-icon
                transition
                class="menu"
            >
            <template slot="label" slot-scope="{ item }" >
                <span v-if="!item.isFolder">
                    <router-link class="none-link" :to="{ name : 'MODULECONTENT', params : LoadModuleContent(item) }"> {{ item.name }} </router-link>
                </span>
                <span v-if="item.isFolder">
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
export default {
    name:"it-menu",
    props: ["menu"],
    computed:{
        ItemsMenu(){
            var reWriteitems=[{}]
            for(var i of this.menu.items){
                var object = i;
                if(!object.children){
                    object.children = [];
                }
                reWriteitems.push(object);
            }
            return reWriteitems;
        }
    },
    methods:{
        LoadModuleContent(item){
            return { module : item.codeMenu }
        }
    }
}
</script>

<style scoped>
    .menu{
        text-align: left;
    }
    .menu-content{
        display: block;
        float: left;
        width: 50%;
    }
    .none-link{
        color: black;
        text-decoration: none !important;
    }
</style>
