<template>
    
    <div>
        <div class="menu-content">
            <v-treeview
                :items="Items"
                item-key="name"
                open-on-click
                hoverable
                indeterminate-icon
                transition
                class="menu"
            >
            <template slot="label" slot-scope="{ item }">
                <router-link  :to="{ name:'MODULECONTENT', params:{module:item.codeMenu}}"> <a>{{ item.name }}</a></router-link>
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
        Items(){
            return this.menu.items;
        },
        MenuModuleContent(){
            return this.menu.favoriteModuleContent.paragraphItem;
        }
    },
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
</style>
