<template>
    <v-container>
        <v-layout wrap>
            <v-flex sm12  xs12 md12  lg6 class="left-component">
                <div class="wrapDiagram">
                    <health-diagram ></health-diagram>
                </div>
            </v-flex>
            <v-flex sm12  xs12 md12  lg6  class="right-component">
                <health-table ></health-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Diagram from "./DiagramWebRequestEscalationsForWeek";
import Table from "./TableWebEscalations";
export default {
    components: {
        'health-diagram':Diagram,
        'health-table':Table,
    }

}
</script>

<style >
.wrapDiagram{
    background: white;
    text-align: center;
    color: #999;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
    border-radius: 3px;
    height: 576px;
  } 
 
</style>
