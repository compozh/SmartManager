<template>
    <div>
        <v-btn v-bind:class="{checked:inCart}" class="add_button" @click.stop="" v-on:click.prevent="addToCart()" icon>
            <v-icon v-text="inCart ? 'remove_shopping_cart' : 'add_shopping_cart'" />
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
    name: "add2cart-btn",
    data:()=>({
        inCart: false
    }),
    props:{
        keyValue:{
            type: String,
            required: true
        }
    },
    created: function () {
            //this.$store.watch(state => state.purchases.favlists, this.checkInFavourite);
            //this.checkInFavourite();
        },
    methods:{
        /*
        favClick(){
            this.inFavourite = !this.inFavourite;
            if(this.inFavourite){
                api.addToFavoritesMutation(this.alias, this.keyValue.toString());
            }else{
                api.deleteItemFromFavorites(this.alias, this.keyValue.toString());
            }
            
        }*/
        addToCart(){
            this.inCart = !this.inCart;
        }
    }
}
</script>

<style scoped>
    .add_button:hover{
        color:green;
    }

    .checked{
        color:green;
    }

</style>

