<template>
    <v-text-field class ="quantity-input" :disabled="!editable"
        :value="quantityType[fieldNameComp]" 
        append-icon="add" 
        @click:append="mutationChangeQuantity(MUTATION_TYPE.PLUS)"
        prepend-inner-icon="remove" 
        @click:prepend-inner="mutationChangeQuantity(MUTATION_TYPE.MINUS)"
        :label="labelNameComp"
        />
</template>

<script>
    export default {
        name: "quantity-text-field",
        data:() => ({
            MUTATION_TYPE: { 
                PLUS: 1, 
                MINUS:-1 
            }
        }),
        props: {
            quantityType: {},
            fieldName: "",
            labelName: "",
            editable: true
        },
        methods: {
            mutationChangeQuantity(arg){
                this.quantityType.quantity += arg;
                this.$emit('onChangeValue', this.quantityType.quantity);
            }
        },
        computed:{
            fieldNameComp(){
                return this.fieldName ? this.fieldName : "quantity";
            },
            labelNameComp(){
                return this.labelName ? this.labelName : "Количество";
            }
        }
    }
</script>

<style>
.quantity-input input{
  text-align: center;
}
</style>