<template>
    <v-layout justify-center>
    <div v-if="!items" class="icon-frame justify-center">
        <v-icon v-text="'photo_camera'" :size="height"/>
    </div>
    <div v-if="items" class="icon-frame" @mouseover="mouceMove(true)" @mouseleave="mouceMove(false)">
       <v-carousel hide-controls hide-delimiters  interval="2000" :height="height" :cycle="hover">
            <v-carousel-item
                v-for="(item, i) in items"
                :key="i"
                :src="item"
                :style="`width: ${width}; height:auto;`"
                transition="fade-transition"
                reverse-transition="fade-transition"
            />
        </v-carousel>
    </div>
    </v-layout>
</template>

<script>
    import purchasesSchemaAxios from "../BaseFunctions"
    // import { isUndefined } from 'util';
    // import { async } from 'q';
    export default {
        name: "item-picture",
        props:{
            entityName: {
                type: String,
                required: true
            },
            id: {
                type: undefined,
                required: true
            },
            width: {
                type: String
            },
            height: {
                type: String
            }
        },        
        data:()=>({
            items:undefined,
            hover: false
        }),
        methods:{
           respCallback(resp){
               if (resp.data.data.purchases.items.length > 0)
               {
                    var item = resp.data.data.purchases.items[0];
                    if (item.content && item.content.length > 0)
                    {
                        this.items =  item.content;
                    }
               }
           },
           mouceMove(val){
               this.hover = val;
           }
        },
        created: function () {
            debugger;
            var query = `{
                purchases{
                    items: ${this.entityName} (id:"${this.id}"){
                        content
                    }
                }
            } `;
            purchasesSchemaAxios(this, query).then(this.respCallback);
        },
        

    }
</script>

<style>
.icon-frame {
    border: 0px none;
    width: 100%;
    height: 80%;
    display: flex;
    justify-self: center;
}
.icon-frame .v-carousel{
    box-shadow: none;
}
</style>


