<template>
    <material-card
          color="#008ffb"
          :title="title"
        >
          <v-data-table
            :headers="headers"
            :items="dataSchedulerFails"
            hide-actions
            style="height:506px; overflow:auto"
            class="container-v-data-table"
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
                class="font-weight-light  text--darken-3"
                v-text="header.text"
                :title="header.text"
              />
            </template>
            <template
              slot="items"
              slot-scope="{ item }"
            >
              <tr @click="RequestDetailInformation(item.item.TaskCode)" :class="item.selected ? 'select-row':''">
              <td class="other-class-td">{{ item.item.TaskCode }}</td>
              <td class="text-xs-left"><a class="table-link" :href="item.item.Link" target="_blank"> {{ item.item.TaskName }}</a></td>
              <td class="text-xs-left">{{ item.item.Result }}</td>
              <td class="text-xs-left">{{ ConvertData(item.item.DateStart) }}</td>
              <td class="text-xs-left">{{ ConvertData(item.item.DateEnd) }}</td>
              </tr>
            </template>
          </v-data-table>
        </material-card>


</template>

<script>
import moment from 'moment'

export default {
    data(){
        return{
          isSelected:false,
          detailSchedulerFails:{
            criterion:"SchedFails",
            date:"null",
            parameters:"",
          },
            emptyData:'Нет данных за ' + moment(this.$store.getters.getInfoList.Date).format("DD.MM.YYYY"),
            dataSchedulerFails: [],
            headers: [],
        }
    },
    computed:{
        schedulerFails(){
            return this.$store.getters.getInfoList.SchedulerFails
        },
        title(){
          return this.$store.getters.getInfoList.TitleOfSchedulerFails
        },
        Unypz(){
          return this.$store.getters.getInfoList.TitleOfSchedUnypzColumn
        },
        StartDate(){
          return this.$store.getters.getInfoList.TitleOfSchedStartDateColumn
        },
        Name(){
          return this.$store.getters.getInfoList.TitleOfSchedNameColumn
        },
        Flag(){
          return this.$store.getters.getInfoList.TitleOfSchedFlagColumn
        },
        EndDate(){
          return this.$store.getters.getInfoList.TitleOfSchedEndDateColumn
        }
    },
    methods:{
        GetSchedulerFails(){
            this.dataSchedulerFails=[];
            this.SetHeaders();
            setTimeout(function(){
            for(var key in this.schedulerFails){
              var object={
                item:this.schedulerFails[key],
                selected:false
              }
                this.dataSchedulerFails.push(object);
            }
            if(this.dataSchedulerFails[0]){
                this.dataSchedulerFails[0].selected=true
                this.RequestDetailInformation(this.dataSchedulerFails[0].item.TaskCode)
              }
              }.bind(this),10)
        },
        ConvertData(str){
          var number=parseInt(str.replace(/\D+/g,""))
          var formattedDate = moment(number).format('DD.MM.YYYY HH:mm:ss')
          return formattedDate
        },
        RequestDetailInformation(code){
          this.dataSchedulerFails = this.dataSchedulerFails.map(function(i){
            if(i.item.TaskCode==code){
             return {item:i.item,selected:true};
            }
             else{
              return {item:i.item,selected:false}
             }
          })
          this.detailSchedulerFails.parameters=code
          this.$store.dispatch('GetDetailsInformationForTable',this.detailSchedulerFails)
        },
        SetHeaders(){
          this.headers.splice(0,this.headers.length);
          var obj=[{
                text: this.Unypz,
                value: 'item.TaskCode',
                align: 'left',
                width: '80px',
            },{
                text: this.Name,
                value: 'item.TaskName',
                align: 'left',
                width: '80px'
            },{
                text: this.Flag,
                value: 'item.Result',
                align: 'left',
                width: '80px'

            },{
                text: this.StartDate,
                value: 'item.DateStart',
                align: 'left',
                width: '80px'

            },{
                text: this.EndDate,
                value: 'item.DateEnd',
                align: 'left',
                width: '80px'
            }]
            this.headers=obj;
        },
    },
    watch:{
        schedulerFails:function(){
        this.GetSchedulerFails();
      }
    }
    

}
</script>

<style >
 .v-table tbody tr:not(:last-child) {
    border-bottom: none;
}
.text-header{
  color:#fff !important;
}
.font-weight-light{
  color:#48a420  !important;
}
.selected{
  background-color: #48a42067
}
  
.other-class-td{
  word-wrap: break-word;  
} 
.select-row{
  background: rgba(72, 164, 32, 0.1);
}
.v-card .title{
  color:#fff !important;
}
.theme--light.v-table{
  table-layout: fixed;
}
.theme--light.v-table thead th{
text-overflow: ellipsis !important;
    overflow: hidden !important;
}
/* действует на все ссылки */
.table-link:hover{
  text-decoration:underline;
}

</style>
