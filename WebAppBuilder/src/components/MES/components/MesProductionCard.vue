<template>
    <v-card-text class="mes-production-card">
        <span v-html="production.description"></span>
    </v-card-text>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    props: {
        production: Object
    },
    name: "mes-production-card"
}
</script>
<style type="text/css" scoped>
    .mes-production-card {
        display: flex;
    }
</style>
