<template>
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
    </div>
</template>

<script>
    export default {
        name: "text-area-with-lock-edit",
        props: {
            item: {},
            fieldName: { type: String },
            labelName: { type: String },
            disable: { type: Boolean }
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