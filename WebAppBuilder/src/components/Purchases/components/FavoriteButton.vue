<template>
    <div>
        <v-btn icon @click.stop="" v-on:click.prevent="favClick()">
            <v-icon v-text="inFavourite ? 'favorite' : 'favorite_border'" />
        </v-btn>
    </div>
</template>

<script>
import Axios from "axios";
import purchasesSchemaAxios from "../api/BaseFunctions";
import {PurchasesApi} from "../api/purchasesApi";
import RemoveButton from "../components/RemoveButton.vue"
import ModalWindowOrderCreation from "../components/ModalWindowOrderCreation.vue"
import TooltipCartItemWithResource from "../components/TooltipCartItemWithResource.vue"
import TextAreaWithLockEdit from "../components/TextAreaLockEdit.vue"
import { debug, debuglog } from 'util';

const api = new PurchasesApi();

export default {
    name: "favorite-btn",
    data:()=>({
        inFavourite: false
    }),
    props:{
        value: {
            type: undefined,
            required: true
        },
        valueName: {
            type: String,
            required: false
        },
        keyValue:{
            type: String,
            required: true
        },
        alias:{
            type: String,
            required: true
        },
    },
    created: function () {
            this.$store.watch(state => state.purchases.favlists, this.checkInFavourite);
            this.checkInFavourite();
        },
    methods:{
        favClick(){
            this.inFavourite = !this.inFavourite;
            if(this.inFavourite){
                api.addToFavoritesMutation(this.alias, this.keyValue.toString());
            }else{
                api.deleteItemFromFavorites(this.alias, this.keyValue.toString());
            }
            
        },
        checkInFavourite(){
            
            this.inFavourite = false;
            const favlists = this.$store.state.purchases.favlists;
           
            if(favlists != null)
            {
                //this.inFavourite = favlists.where(w=>w.alias = this.alias).selectmany(w=>w.keyValues).any(w=>w == this.keyValue)
                 this.inFavourite = favlists.filter((w)=>w.alias == this.alias).map((w) => w.keyValues).
                        reduce((prev, next) => { return prev.concat(next); }, []).some( w => w == this.keyValue);
            }
           
        }
    }
}
</script>
