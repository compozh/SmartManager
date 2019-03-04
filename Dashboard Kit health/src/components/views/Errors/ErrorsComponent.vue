<template>
    <v-container>
        <v-layout>
            <!-- <v-flex sm6  xs12 md6  lg2 class="card">
                <health-card sm6  xs12 md6  lg2 ></health-card>
            </v-flex> -->

            <v-flex sm6  xs12 md6  lg6 >
                <div class="wrapDiagram">
                <health-diagram ></health-diagram>
                </div>
            </v-flex>
            <v-flex sm6  xs12 md6  lg6 class="table" style="height:600px;">
                <health-table></health-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
// import Card from "./CardTotalCountErrorsToday";
import Diagram from "./DiagramErrorsForWeek";
import Table from "./TableErrorsForToday";
export default {
    components: {
        // 'health-card':Card,
        'health-diagram':Diagram,
        'health-table':Table,
    }
}
</script>

<style >
    .table{
        max-height: 600px;
    }
  .wrapDiagram{
    background: white;
    text-align: center;
    color: #999;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
    border-radius: 3px;
    height: 576px;
  } 
  .v-card{
  margin: 0px !important;
}
</style>
