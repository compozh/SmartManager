<template>
    <v-card-text class="mes-production-card">
        <span v-html="production.description"></span>
        <v-btn icon outlined color="error" flat class="mes-delete-production" @click="deleteProduction"><v-icon dark>delete_forever</v-icon></v-btn>
    </v-card-text>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    props: {
        production: Object
    },
    name: "mes-production-card",
    methods: {
        deleteProduction() {
            this.$emit('deleteProduction');
        }
    }
}
</script>
<style type="text/css" scoped>
.mes-delete-production {
  min-width: auto;
  position: absolute;
  right: 0;
  top: 0;
}
.mes-production-card {
  display: flex;
  align-items: center;
  max-height: 300px;
}
</style>
