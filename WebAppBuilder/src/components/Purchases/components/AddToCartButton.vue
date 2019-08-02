<template>
    <div>
        <v-btn v-if="!inCart" v-bind:class="{checked:inCart}" class="add_button" @click.stop="" v-on:click.prevent="addToCart()" icon>
            <v-icon v-text="'add_shopping_cart'" />
        </v-btn>
        <router-link v-else :to="{ name:'CART', params: {cartItemId: keyValue.trim(), }}">
            <v-btn v-bind:class="{checked:inCart}" class="add_button" icon>
                <v-icon v-text="'shopping_cart'" />
            </v-btn>
        </router-link>
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
        debugger;
            this.$store.watch(state => state.purchases.cartitems, this.checkInCart);
            this.checkInCart();
        },
    methods:{
        
        addToCart(){
            this.inCart = !this.inCart;
            if(this.inCart){
                api.addToCartMutation(this.keyValue.toString());
            }
        },

        checkInCart(){
            const cartlist = this.$store.getters["purchases/getCartItems"];
            if(cartlist != null)
            {
                for(let i=0;i<cartlist.length;i++){
                    if(cartlist[i].resource.id == this.keyValue){
                        this.inCart = true;
                        break;
                    }
                }             
                //this.inCart = cartlist.map((w) => w.keyValues).
                //    reduce((prev, next) => { return prev.concat(next); }, []).some( w => w == this.keyValue);
            }
           
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

    a{
        text-decoration: none;
    }

</style>



