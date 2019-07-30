<template>
    <v-text-field class ="quantity-input" :disabled="!editable"
        :value="this.quantity"
        placeholder="0"
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
            quantity: Number,
            fieldName: "",
            labelName: "",
            editable: true
        },
        methods: {
            mutationChangeQuantity(arg){
                this.quantity += arg;
                this.$emit('onChangeValue', this.quantity);
            }
        },
        computed:{
            fieldNameComp(){
                return this.fieldName ? this.fieldName : "quantity";
            },
            labelNameComp(){
                return this.labelName ? this.labelName : $t('purchases.CartItems.Quantity');;
            }
        },
        created(){
            let test = this.quantity;
        }
    }
</script>

<style scoped>
.quantity-input >>> input{
  text-align: center;
}
</style>