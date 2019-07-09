<template>
<v-container fluid> 
    <v-layout row>
        <v-flex sm11 xs11>
            <v-textarea
            no-resize
            v-model="item[fieldName]" 
            :disabled="disabled"/>
        </v-flex>
        <v-flex sm1 xs1>
            <v-btn icon @click="callBack">
                    <v-icon v-text="disabled ? 'edit' : 'save'" />
                </v-btn>
        </v-flex>
    </v-layout>
</v-container>
<!--
    <div>
        <v-textarea 
            v-model="item[fieldName]" 
            :disabled="disable" 
        >
            <template v-slot:append>
                <v-btn icon @click="callBack">
                    <v-icon v-text="disable ? 'edit' : 'save'" />
                </v-btn>
            </template>
        </v-textarea>
    </div>-->
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
        methods:{
            callBack(){
                debugger;
                this.disable = !this.disable;
                this.$emit('click');
                
            }
        }
    }
</script>

<style scoped>
    .v-textarea{
        border-style: none;
    }
</style>