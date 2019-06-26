<template>
    <v-card>
        <item-picture  entityName="resources" :id="itemCode"/>
    </v-card>
</template>

<script>
    export default {
        name: "catalogue-item",
        props:{
            catalogueId: undefined
        },
        computed:{
            itemCode(){
                return tis.$route.params.catalogueId
            }
        }
    }
</script>

<style>

</style>