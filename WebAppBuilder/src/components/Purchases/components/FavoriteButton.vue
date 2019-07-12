<template>
    <div>
        <v-btn icon @click.stop="">
            <v-icon v-text="inFavourite ? 'favorite' : 'favorite_border'" />
        </v-btn>
    </div>
</template>

<script>
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
            }
        },
        computed:{
            inFavourite(){
                return false;
            }
        }
    }
</script>
