<template>
    <v-autocomplete 
        :disabled="!editable"
        v-model="resourceComp"
        :loading="loading"
        :items="[...items, resourceComp]"
        :search-input.sync="search"
        cache-items
        hide-no-data
        hide-details
        :label="labelNameComp"
        return-object
        item-text="fullName"
        clearable  
    />
</template>

<script>
    import purchasesSchemaAxios from "../BaseFunctions"
    export default {
        name: "resource-autocomplete",
        props:{
            resource: {},
            labelName: "",
            editable: true
        },
        data:()=>({
            loading: false,
            items: [],
            search: null,
            timeout: 0
        }),
        computed:{
            labelNameComp(){
                return this.labelName ? this.labelName : "Количество";
            },
            resourceComp:{
                get: function() {
                    return this.resource;
                },
                set: function(value){
                    this.resource.id = value.id;
                    this.resource.fullName = value.fullName;
                    this.$emit('onChangeValue', this.resource)
                }
            },
            editableComp(){
                return this.editable !== undefined ? this.editable : true;
            }
        },
        watch: {
            search (val) {
                val && 
                val !== this.resource.name && 
                this.querySelections(val)
            }
        },
        methods:{
            querySelections(val){
                const q = `{ purchases { resources (name: "${val.replace(/"/g,'')}"){fullName,id}}}`
                purchasesSchemaAxios(this, q, resp => {
                    //this.items = resp.data.data.purchases.resources;
                })
            }
        }
    }
</script>

<style>

</style>