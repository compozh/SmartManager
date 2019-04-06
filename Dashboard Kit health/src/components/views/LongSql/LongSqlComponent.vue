<template>
    <v-container>
        <v-layout>
            <v-flex sm6  xs12 md6  lg6 class="left-component">
                <div class="wrapDiagram">
                <health-diagram  ></health-diagram>
                </div>
            </v-flex>

            <v-flex sm6  xs12 md6  lg6 class="right-component">
                <health-table ></health-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Diagram from "./DiagramLongSqlQueriesForWeek";
import Table from "./TableLongSqlQueriesForToday";
export default {
    components: {
        'health-diagram':Diagram,
        'health-table':Table,

    }

}
</script>

<style>

  .wrapDiagram{
    background: white;
    text-align: center;
    color: #999;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
    border-radius: 3px;
    height: 576px;
  } 
  .left-component{
      position: absolute; 
      left: 0; 
      width: 100%;
  }
  .right-component{
    height:600px; 
    position: absolute; 
    right: 0; 
    width: 100%;
  }
</style>
