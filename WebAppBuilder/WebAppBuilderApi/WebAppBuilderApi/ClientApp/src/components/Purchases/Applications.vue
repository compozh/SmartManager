<template>
    <div v-if="applications">
        <v-card v-for="application in applications" :key="application.uniqueNumber">

        </v-card>
    </div>
</template>

<script>
    export default {
        name: "applications",
        props: ["applications"]
    }
</script>

<style>

</style>