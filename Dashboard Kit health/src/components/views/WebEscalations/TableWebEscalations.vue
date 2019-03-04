<template>
    <material-card color="#48a420" :title="headTitle?headTitle:emptyHeader" >
          <v-data-table :headers="headersWebEscalation" :items="dataWebEscalation" hide-actions color='' 
          style="height:506px; overflow:auto"
          >
           <template slot="no-data">
            <p class="empty-data-in-table">{{emptyData}}</p>
          </template>
            <template slot="headerCell" slot-scope="{ header }" class="table-header">
              <span class="font-weight-light text--darken-3" 
              v-text="header.text"
              :title="header.text"/>
            </template>
            <template
              slot="items"
              slot-scope="{ item }"
            >
              <td>{{ item.RequestId }}</td>
              <td class="text-xs-left">{{ item.CalcId }}</td>
              <td class="text-xs-left">{{ item.Unypz }}</td>
              <td class="text-xs-left">{{ item.Date }}</td>
            </template>
          </v-data-table>
        </material-card>
</template>
<script>
import moment from 'moment'
export default {
    data(){
        return{
            headTitle:'',
            emptyHeader:'Web-эскалации за1 ' + moment(this.$store.getters.getInfoList.Date).format("DD.MM.YYYY"),
            emptyData:'',
            dataWebEscalation: [],
            headersWebEscalation: [],
        }
    },
    methods:{
        SetWebescalation(){
          this.headTitle=this.webEscalation.Title
          this.emptyData = "Нет данных " + this.webEscalation.Title
            this.SetHeader();

          this.dataWebEscalation = this.webEscalation.DetailInfoAboutTest;
          for(var key in this.dataWebEscalation)
            {
                var number = parseInt(this.dataWebEscalation[key].Date.replace(/\D+/g,""))
                this.dataWebEscalation[key].Date = moment(number).format("DD.MM.YYYY")
            }
        },
        SetHeader(){
          this.headersWebEscalation.splice(0,this.headersWebEscalation.length);
           var obj=[{
                sortable: false,
                text: this.requestId,
                value: this.requestId,
                align: 'left'
            },{
                sortable: false,
                text: this.calcId,
                value: this.calcId,
                align: 'left'
            },{
                sortable: false,
                text: this.unypz,
                value: this.unypz,
                align: 'left'
            },{
                sortable: false,
                text: this.date,
                value: this.date,
                align: 'left'
            }
            ]
            this.headersWebEscalation=obj

        }
    },
    computed: {
        webEscalation(){
            return this.$store.getters.getDetailWebRequestExec
        },
        requestId(){
          return this.$store.getters.getInfoList.TitleOfWeEscRequestColumn
        },
        calcId(){
          return this.$store.getters.getInfoList.TitleOfWeEscCalcIdColumn
        },
        unypz(){
          return this.$store.getters.getInfoList.TitleOfWeEscUnypzColumn
        },
        date(){
          return this.$store.getters.getInfoList.TitleOfWebEscDateColumn
        },
        bodyDate(){
          return this.$store.getters.getDate;
        }
       
    },
    watch:{
        webEscalation:function(){
          this.SetWebescalation();
        }
    },
    
}
</script>
<style >
.font-weight-light{
  color:#48a420  !important;
}
.empty-data-in-table{
  text-align: center !important;
  font-size: 24px !important;
}
</style>