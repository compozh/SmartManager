<template>
    <v-autocomplete class="measurement-input"
        :disabled="!editable"
        v-model="measurementComp"
        :loading="loading"
        :items="[...items, measurement]"
        :search-input.sync="search"
        cache-items
        hide-no-data
        hide-details
        :label="labelNameComp"
        return-object
        item-text="name"
        />
</template>

<script>
    import purchasesSchemaAxios from "../BaseFunctions"
    export default {
        name: "measurement-autocomplete",
        props:{
            measurement: {},
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
                if (this.labelName)
                    return this.labelName;
                return "Единица измерения";
            },
            measurementComp:{
                get: function() {
                    return this.measurement;
                },
                set: function(value){
                    this.measurement.id = value.id;
                    this.measurement.name = value.name;
                    this.$emit('onChangeValue', this.measurement)
                }
            }
        },
        watch: {
            search (val) {
                val && 
                val !== this.measurement.name && 
                this.querySelections(val)
            }
        },
        methods:{
            querySelections(val){
                const q = `{purchases{measurementUnits(where:[{path:"isValid",comparison:equal,value:"true"},{path:"name",comparison:like,value:"%${val}%"}]){id,name}}}`
                purchasesSchemaAxios(this, q, resp => {
                    this.items = resp.data.data.purchases.measurementUnits;
                })
            }
        }
    }
</script>

<style scoped>
.measurement-input >>> input{
  text-align: center;
}
</style>