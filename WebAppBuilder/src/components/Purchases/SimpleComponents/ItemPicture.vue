<template>
    <v-layout justify-center>
    <div v-if="!items" class="icon-frame justify-center">
        <v-icon v-text="'photo_camera'" size="200px"/>
    </div>
    <div v-if="items" class="icon-frame" @mouseover="mouceMove(true)" @mouseleave="mouceMove(false)">
       <v-carousel hide-controls hide-delimiters height="200px"  interval="2000" :cycle="hover">
            <v-carousel-item
                v-for="(item, i) in items"
                :key="i"
                :src="item"
                style="width: 200px;height:auto;"
                transition="fade-transition"
                reverse-transition="fade-transition"
            />
        </v-carousel>
    </div>
    </v-layout>
</template>

<script>
import purchasesSchemaAxios from "../BaseFunctions"
import { isUndefined } from 'util';
import { async } from 'q';
    export default {
        name: "item-picture",
        props:{
            entityName: {
                type: undefined,
                required: true
            },
            id: {
                type: undefined,
                required: true
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
        created: async function () {
            var query = `{
                purchases{
                    items: ${this.entityName} (id:"${this.id}"){
                        content
                    }
                }
            } `;
            (await purchasesSchemaAxios(this, query).then(this.respCallback));
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
</style>