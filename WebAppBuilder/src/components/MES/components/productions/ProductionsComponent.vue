<template>
    <v-flex class="mes-productions-content">
        <v-card class="productions-card" v-for="production in productions" :key="production.factId">

            <mes-production-card 
                :production=production
                @deleteProduction=deleteProduction(production)
            />
          
        </v-card>
    </v-flex>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    name: "mes-productions-component",
    computed: {
        productions() {
            return this.$store.getters['mes/productions'];
        },
        sortedProductions() {
            return productions.sort((a,b) => {
                return a.factId < b.factId ? 1 : (a.factId == b.factId ? 0 : -1);
            });
        }
    },
    methods: {
        deleteProduction(production) {
            this.$store.dispatch('mes/deleteProduction', production);
        }
    }
}
</script>

<style type="text/css" scoped>
    .mes-productions-content {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: start;
        justify-content: center;
    }
    .productions-card {
        display: flex;
        align-items: start;
        margin: 10px;
        max-width: 400px;
        width: 360px;
        border-radius: 5px;
    }
</style>
