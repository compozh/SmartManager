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
    import {PurchasesApi} from "../api/purchasesApi";
    const api = new PurchasesApi();
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
                return $t('purchases.CartItems.Unit');
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
                if (val && val !== this.measurement.name)
                {
                    this.querySelections(val)
                }
            }
        },
        methods:{
            querySelections(val){
                api.getMeasurementUnits(val).then(this.callback)
            },
            callback(resp)
            {
                this.items = resp.data.purchases.measurementUnits;
            }
        }
    }
</script>

<style lang="scss" scoped>
.measurement-input >>> input{
  text-align: center;
}
</style>