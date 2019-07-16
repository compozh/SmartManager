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
import { debug } from 'util';

const api = new PurchasesApi();

export default {
    name: "favorite-btn",
    // data:()=>({
    //     inFavourite: false
    // }),
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
        }
    },
    computed:{
        inFavourite(){
            return false;
        }
    },
    methods:{
        favClick(){
            debugger;
            api.addToFavoritesMutation(this.alias, this.keyValue.toString());
            console.log(`TODO: fav for application`)
        },
    }
}
</script>
