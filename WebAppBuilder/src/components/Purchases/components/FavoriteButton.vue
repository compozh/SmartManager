<template>
    <div>
        <v-btn v-bind:class="{checked:inFavourite}" class="like_button" icon @click.stop="" v-on:click.prevent="favClick()">
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
        keyValue:{
            type: String,
            required: true
        },
        alias:{
            type: String,
            required: true
        },
        isInFavorite:{
            type: Boolean,
            required: false,
            default: undefined
        },
        
    },
    created: function () {
            this.$store.watch(state => state.purchases.favlists, this.checkInFavourite);
            this.checkInFavourite();
        },
    methods:{
        async favClick(){
            if(!this.inFavourite){
                debugger;
                 await api.addToFavoritesOneMutation(this.alias, this.keyValue.toString(), this);
            }else{
                 api.deleteItemFromFavorites(this.alias, this.keyValue.toString());
            }
            
            this.checkInFavourite();
        },
        checkInFavourite(){
            //this.inFavourite = false;
            const favlists = this.$store.state.purchases.favlists;
            if(favlists)
            {
                this.inFavourite = favlists.filter((w)=>w.alias == this.alias).map((w) => w.keyValues).
                    reduce((prev, next) => { return prev.concat(next); }, []).some( w => w == this.keyValue);
            }
            else
            {
                this.inFavourite = this.isInFavorite;
            }
            
        }
    }
}
</script>

<style scoped>
    .like_button:hover{
        color:red;
    }

    .checked{
        color:red;
    }

</style>

