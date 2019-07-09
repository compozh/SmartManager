<template>
    <v-layout row>
        <v-flex grow>
            <h3 v-if="d">
                <span class="resource-group-text">{{item[fieldName]}}</span>
            </h3>
            <v-textarea
                v-else
                no-resize
                v-model="item[fieldName]" 
                />
        </v-flex>
        <v-flex shrink>
            <v-btn icon @click="callBack">
                    <v-icon v-text="d ? 'edit' : 'save'" />
                </v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "text-area-with-lock-edit",
        props: {
            item: {},
            fieldName: { type: String },
            labelName: { type: String },
            disabled: { type: Boolean }
        },
        data:()=>({
            d: false
        }),
        methods:{
            callBack(){
                this.d = !this.d;
                if(this.d){
                    this.$emit('click');
                }
            }
        },
        created(){
            this.d = this.disabled;
        }
    }
</script>

<style scoped>
    .v-textarea{
        border-style: none;
    }
</style>