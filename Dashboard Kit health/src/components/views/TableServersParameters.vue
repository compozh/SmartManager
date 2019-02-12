<template>
   <material-card
          color="#008FFB"
          title="Параметры серверов с превышениями на сегодня">
          <v-data-table
            :headers="headersError"
            :items="commonArray"
            hide-actions
          >
            <template
              slot="headerCell"
              slot-scope="{ header }"
            >
              <span
                class="font-weight-light text-warning text--darken-3 text-head-color"
                v-text="header.text"
              />
            </template>
            <template
              slot="items"
              slot-scope="{ item }"
              
            >
              <td class="text-td-position" >{{ item.ServerName }}</td>
              <td class="text-td-position" >{{ ConvertData(item.Date) }}</td>
              <td class="text-td-position" >{{ item.Port }}</td>
              <td class="text-td-position" :class="SetBackgraundColor(item.HDD_QUEUE.m)">{{ item.CPU_USED.v }}</td>
              <td class="text-td-position" :class="SetBackgraundColor(item.HDD_QUEUE.m)">{{ item.HDD_QUEUE.v }}</td>
              <td class="text-td-position" :class="SetBackgraundColor(item.HDD_SECRD.m)">{{ item.HDD_SECRD.v }}</td>
              <td class="text-td-position" :class="SetBackgraundColor(item.HDD_SECWR.m)">{{ item.HDD_SECWR.v }}</td>
              <td class="text-td-position" :class="SetBackgraundColor(item.RAM_FREE.m)">{{ item.RAM_FREE.v }}</td>
              <td class="text-td-position" :class="SetBackgraundColor(item.RAM_PGSEC.m)">{{ item.RAM_PGSEC.v }}</td>
            </template>
          </v-data-table>
        </material-card>
</template>

<script>
import UnionServer from "../../utils/CommonServerParams.js"
import moment from 'moment'
export default {
    data(){
    return{
         commonArray:[],
            headersError: [
        {
          sortable: false,
          text: 'Сервер',
          value: 'ServerName'
        },
        {
          sortable: false,
          text: 'Время',
          value: 'Date'
        },{
          sortable: false,
          text: 'Порт',
          value: 'Port'
        },{
          sortable: false,
          text: '% Использования процессора',
          value: 'CPU_USED',
        },{
          sortable: false,
          text: 'Очередь диска',
          value: 'HDD_QUEUE'
        },{
          sortable: false,
          text: 'Время чтения с жесткого диска (мс)',
          value: 'HDD_SECRD'
        },{
          sortable: false,
          text: 'Время записи на жесткий диск (мс)',
          value: 'HDD_SECWR'
        },{
          sortable: false,
          text: 'Свободно ОЗУ (Гб)',
          value: 'RAM_FREE'
        },{
          sortable: false,
          text: 'Обмен памяти с диском (страниц/сек)',
          value: 'RAM_PGSEC'
        }
        ],
        }
    },
    computed:{
        serversParameters(){
            return this.$store.getters.getInfoList.ServersParametersWithExceedancesForToday
            // return this.$store.getters.getInfoList.ServersParametersWithExceedancesForYesterday
        },
        perfExceedances(){
            // return this.$store.getters.getInfoList.PerfExceedancesForYesterday
            return this.$store.getters.getInfoList.PerfExceedancesForToday
        }
    },
    methods:{
        GetServersParams(serverParams){
        },
        CreateNewObject(array){
          for(var key in array){
            console.log(array[key])
          }
        },
        SetBackgraundColor(val){
          switch (val) {
            case 1:
            return "norms"
              break;
              case 2:
            return "warnings"
              break;
              case 3:
              return "errors"
              break;
            default:
              break;
          }
        },
        ConvertData(str){
          var number=parseInt(str.replace(/\D+/g,""))
          var formattedDate = moment(number).format('YYYY-MM-DD-HH:MM')
          return formattedDate
        },
        GetPerfExceedances(PerfExceedanseParams, serverParams){
             var data=UnionServer(PerfExceedanseParams,serverParams)
                for(var k in data){
                    this.commonArray.push(data[k])
                }
        },
    },
    watch:{
        perfExceedances:function(){
            this.GetPerfExceedances(this.perfExceedances,this.serversParameters);
        },
    }
}
</script>

<style scoped>
  .norms{
        background: rgba(42, 255, 14, 0.2);
  }
  .warnings{
        background: rgba(253, 238, 27, 0.2);
  }
  .errors{
      background: rgba(223, 12, 12, 0.2);
  }
  .text-head-color{
    color:black !important;
    /* #008FFB */
  }
  .text-td-position{
    text-align: center
  }
</style>
