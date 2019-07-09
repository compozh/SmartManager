<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <span v-on="on">
                <h3>
                    <span class="resource-group-text">[{{cartItem.resource.resourceGroup.name | truncate(getTextLength(20,20,40,40,40), '...')}}]</span>
                      {{cartItem.resource.name | truncate(getTextLength(100,80,200,500,500), '...')}}
                </h3>
            </span>
        </template>
            <span class="hidden-lg-and-up">
                <span>{{cartItem.resource.name}}</span><br/>
                <item-picture class="hidden-sm-and-up" entityName="resources" :id="cartItem.resource.id" height="100px" width="100px"/>
            </span>
    </v-tooltip>
</template>

<script>
    export default {
        name: "text-area-with-resource",
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
