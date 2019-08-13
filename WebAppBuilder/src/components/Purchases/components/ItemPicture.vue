<template>
    <v-layout justify-center :style="`width: ${width}; height: ${height};`" >
    <div :style="`width: ${width};`" v-if="items.length == 0" class="icon-frame justify-center">
        <v-icon v-text="'photo_camera'" :size="height"/>
    </div>
    <div :style="`width: ${width};`" v-else class="icon-frame justify-center" @mouseover="mouceMove(true)" @mouseleave="mouceMove(false)">
       <v-carousel hide-controls hide-delimiters  interval="2000" :cycle="hover" :height="height" :width="width">
            <v-carousel-item
                v-for="(item, i) in items"
                :key="i"
                :src="item" 
                :height="height" 
                :width="width"
                transition="fade-transition"
                reverse-transition="fade-transition"
            />
        </v-carousel>
    </div>
    </v-layout>
</template>

<script>
    import {PurchasesApi} from "../api/purchasesApi";
    
    const api = new PurchasesApi();

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
            items: [],
            hover: false
        }),
        methods:{
            respCallback(resp){
                // debugger;
                var contents = resp.data.purchases[this.entityName];
                if (contents != null) {
                    if (contents.content && contents.content.length > 0) {
                        this.items = this.items.concat(contents.content);
                    }
                    if(contents.attachments && contents.attachments.length > 0) {
                        for (const key in contents.attachments) {
                            if (contents.attachments.hasOwnProperty(key)) {
                                const element = contents.attachments[key];
                                this.items.push(element.url+"&nodownload=1&cache=0")
                            }
                        }
                    }
                }
           },
           mouceMove(val){
               this.hover = val;
           }
        },
        computed: {
            isResourceItem(){
                return this.id.trim().length == 15;
            }
        },
        created: function () {
            var promise = 
                this.isResourceItem 
                    ? api.getImagesForCatalogueItem(this.id)
                    : api.getImagesForCatalogueGroup(this.id);
            
            promise.then(this.respCallback);
        },
        

    }
</script>

<style lang="scss" scoped>
.icon-frame {
    border: 0px none;
    display: flex;
    justify-self: center;
}
.v-carousel{
    box-shadow: none;
}
</style>


