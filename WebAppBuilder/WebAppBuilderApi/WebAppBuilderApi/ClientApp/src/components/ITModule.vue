<template>
<div>
<span>{{Module.title}}</span>
    <v-treeview
        v-model="tree"
        :items="Module.paragraphItem"
        item-key="name"
        open-on-click
        hoverable
        indeterminate-icon
        transition
        class="menu"
    >
    </v-treeview>
    </div>
</template>

<script>
export default {
    name:"it-module",
    props: ["module"],
    computed:{
        Module(){
            return this.module;
        }
    }
}
</script>

<style scoped>
    .menu{
        text-align: left;
    }
</style>
