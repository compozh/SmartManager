<template>
    <v-container>
        <v-layout>

            <v-flex sm6  xs12 md6  lg6 style="height:600px;" class="left-component"> 
                <health-table ></health-table>
            </v-flex>
            <v-flex sm6  xs12 md6  lg6 v-if="showIframe" class="right-component">
                <div >
                <health-iframe style="height:576px;"></health-iframe>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import IframeScheduler from "./IframeDetailSchedulerFails";
import Table from "./TableSchedulerFails";
export default {
    components: {
        'health-table':Table,
        'health-iframe':IframeScheduler,
    },
    computed:{
        showIframe(){
            return this.$store.getters.getShowiframe;
        }
    }
}
</script>

<style>

 
</style>
