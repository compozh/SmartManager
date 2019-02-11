<template>
          <material-card
          color="info"
          title="Длинные SQL запросы за сегодня"
        >
          <v-data-table
            :headers="headers"
            :items="LongSqlQueryToday"
            hide-actions
          >
            <template
              slot="headerCell"
              slot-scope="{ header }"
            >
              <span
                class="font-weight-light text-warning text--darken-3"
                v-text="header.text"
              />
            </template>
            <template
              slot="items"
              slot-scope="{ item }"
            >
              <td class="text-xs">{{ item.EntryPoint }}</td>
              <td class="text-xs-center">{{ item.Count }}</td>
              <td class="text-xs-right">{{ item.AverageTime }}</td>
            </template>
          </v-data-table>
        </material-card>
</template>

<script>
import FindMaxValue from "../../utils/FindMaxValue.js"
export default {
    data(){
        return{
          LongSqlQueryToday:[{
          }],
          headers: [{
                sortable: false,
                text: 'Наименование',
                value: 'name'
            },{
                sortable: false,
                text: 'Количество',
                value: 'count',
                align: 'center'
            },{
                sortable: false,
                text: 'Среднее время',
                value: 'avrgTime',
                align: 'right'

            }],
        }
    },
    methods:{
        
        GetLongSqlQueriesForToday(){
            this.LongSqlQueryToday=[]
            for(var key in this.longSqlQueriesForToday){
                this.LongSqlQueryToday.push(this.longSqlQueriesForToday[key])
            }
        },
    },
    computed:{
       longSqlQueriesForToday(){
          return this.$store.getters.getInfoList.LongSqlQueriesForToday
        }
    },
    watch:{
        longSqlQueriesForToday:function(){
        this.GetLongSqlQueriesForToday();
      },
    }
}
</script>

<style scoped>
  .unicwrapdiagram{
    background: white;
    border-radius: 10px;
    text-align: center;
  }
  .unicwrapdiagram > h4{
    color: #999;
  }
  .my-text-info{
    position: relative;
    left: -20%
  }
.font-weight-light{
  color:#26c6da  !important;
}

  
</style>
