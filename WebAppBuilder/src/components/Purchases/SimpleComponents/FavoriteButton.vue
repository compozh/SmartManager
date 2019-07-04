<template>
    <div>
        <v-btn icon>
            <v-icon v-text="inFavourite ? 'favorite' : 'favorite_border'" />
        </v-btn>
    </div>
</template>

<script>
    export default {
        name: "favorite-btn",
        data:()=>({
            inFavourite: false
        }),
        props:{
            favKey: {
                type: undefined,
                required: true
            },
            favType: {
                type: String,
                required: true
            }
        }
        
    }
</script>
