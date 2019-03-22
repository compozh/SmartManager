<template>
          <material-card
          color="#008ffb"
          :title="headTitle"
        >
          <v-data-table
            :headers="headers"
            :items="LongSqlQueryToday"
            hide-actions
            style="height:506px; overflow:auto"
            sort-icon=""
          >
           <template slot="no-data">
            <p class="empty-data-in-table">{{emptyData}}</p>
          </template>
            <template
              slot="headerCell"
              slot-scope="{ header }"
            >
            <v-icon small>arrow_drop_down</v-icon>
              <span
                class="font-weight-light text-warning text--darken-3"
                v-text="header.text"
                :title="header.text"
              />
            </template>
            <template
              slot="items"
              slot-scope="{ item }"
            >
              <td class="text-xs"><a class="table-link" href="" target="_blank">{{ item.EntryPoint  }}</a> </td>
              <td class="text-xs-left">{{ item.Count }}</td>
              <td class="text-xs-left">{{ item.AverageTime }}</td>
            </template>
          </v-data-table>
        </material-card>
</template>

<script>
import FindMaxValue from "../../../utils/FindMaxValue.js"
import moment from 'moment'
export default {
    data(){
        return{
          headTitle:'',
          emptyData:"Нет данных за " + moment(this.$store.getters.getInfoList.Date).format("DD.MM.YYYY"),
          LongSqlQueryToday:[{
          }],
          headers: [],
        }
    },
    methods:{
        
        GetLongSqlQueriesForToday(){
          this.headTitle=this.title
          this.SetHeaders();
          this.LongSqlQueryToday=[]
          for(var key in this.longSqlQueriesForToday){
              this.LongSqlQueryToday.push(this.longSqlQueriesForToday[key])
          }
        },
        SetCurentlongSqlQueries(){
          this.LongSqlQueryToday=[]
          this.headTitle=this.curentlongSqlQueries.Title
            for(var key in this.curentlongSqlQueries.DetailInfoAboutTest){
                this.LongSqlQueryToday.push(this.curentlongSqlQueries.DetailInfoAboutTest[key])
            }
        },
        SetHeaders(){
            this.headers.splice(0,this.headers.length);
            var obj=[
                      {
                        text: this.entryPoint,
                        align: 'left',
                        sortable: true,
                        value: 'EntryPoint',
                      },
                      {
                        text: this.count,
                        sortable: true,
                        value: 'Count',
                        align: 'left'
                      },
                      {
                        text: this.avgtTime,
                        sortable: true,
                        value: 'AverageTime',
                        align: 'left'
                      }
                    ]

            this.headers=obj

        }
    },
    computed:{
       longSqlQueriesForToday(){
          return this.$store.getters.getInfoList.LongSqlQueriesForDate
        },
        title(){
          return this.$store.getters.getInfoList.TitleOfTopCommonLongQueriesForDate
        },
        curentlongSqlQueries(){
          return this.$store.getters.getDetailsSQLLongTable
        },
        avgtTime(){
          return this.$store.getters.getInfoList.TitleOfLogsAvgTimeColumn
        },
        count(){
          return this.$store.getters.getInfoList.TitleOfLogsCountColumn
        },
        entryPoint(){
          return this.$store.getters.getInfoList.TitleOfLogsEntryPointColumn
        }
    },
    watch:{
        longSqlQueriesForToday:function(){
        this.GetLongSqlQueriesForToday();
      },
      curentlongSqlQueries:function(){
        this.SetCurentlongSqlQueries()
      }
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
  color:#48a420  !important;
}


</style>
