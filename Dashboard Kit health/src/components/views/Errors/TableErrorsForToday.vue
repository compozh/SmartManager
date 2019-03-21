<template>
    <material-card
          color="#48a420"
          :title="headTitle"
        >
          <v-data-table
            :headers="headersError"
            :items="dataErrorForToday"
            hide-actions
            color=''
            style="height:506px; overflow:auto"
          >
          <template slot="no-data">
            <p class="empty-data-in-table">{{emptyData}}</p>
          </template>

            <template
              slot="headerCell"
              slot-scope="{ header }"
              class="table-header"
            >
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
              <td><a :href="item.Link" target="_blank">{{ item.EntryPoint  }}</a> </td>
              <td class="text-xs-left">{{ item.Count }}</td>
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
            dataErrorForToday: [],//на самом деле еще будет свойство для перехода по ссылке поэтому нужда в goToLink отпадет
            headersError: [],
            emptyData:"Нет данных за " + moment(this.$store.getters.getInfoList.Date).format("DD.MM.YYYY"),
        }
    },
    methods:{
        GetErrorToday(){
            this.headTitle=this.title
            this.SetHeaders();
            this.dataErrorForToday=[];
            for(var key in this.errorsForToday){
              //симуляция ссылки
              let obj={
                CallChain:this.errorsForToday[key].CallChain,
                Count:this.errorsForToday[key].Count,
                EntryPoint:this.errorsForToday[key].EntryPoint,
                ErrorMessage:this.errorsForToday[key].ErrorMessage,
                Link:"https://m.it.ua/skd"
              } 
               this.dataErrorForToday.push(obj);
              //  this.dataErrorForToday.push(this.errorsForToday[key]);
            }

        },
        //загружаем данные при запросе из столбца
        SetCurentErrors(){
            this.dataErrorForToday=[];
            this.headTitle=this.curentError.Title
            for(var key in this.curentError.DetailInfoAboutTest){
              //симуляция ссылки
              let obj={
                CallChain:this.curentError.DetailInfoAboutTest[key].CallChain,
                Count:this.curentError.DetailInfoAboutTest[key].Count,
                EntryPoint:this.curentError.DetailInfoAboutTest[key].EntryPoint,
                ErrorMessage:this.curentError.DetailInfoAboutTest[key].ErrorMessage,
                Link:"http://google.com"
              } 
               this.dataErrorForToday.push(obj);
              //  this.dataErrorForToday.push(this.curentError.DetailInfoAboutTest[key]);
            }
        },
        SetHeaders(){
            this.headersError.splice(0,this.headersError.length);
             var obj=[
                      {
                        text: this.entryPoint,
                        align: 'left',
                        sortable: false,
                        value: 'ErrorMessage',
                      },
                      {
                        text: this.count,
                        value: 'Count',
                        align: 'left',
                      }
                    ]
            this.headersError=obj
        }
    },
    computed: {
        errorsForToday(){
            return this.$store.getters.getInfoList.ErrorsForDate
        },
        title(){
          return this.$store.getters.getInfoList.TitleOfTopCommonErrorsForDate
        },
        curentError(){
          return this.$store.getters.getDetailsErrorsTable
        },
        entryPoint(){
            return this.$store.getters.getInfoList.TitleOfErrorsEntryPoint
        },
        count(){
            return this.$store.getters.getInfoList.TitleOfErrorsCountColumn
        },
        
    },
    watch:{
        errorsForToday:function () {
          this.GetErrorToday();
        },
        curentError:function(){
          this.SetCurentErrors();
        }
    },
}
</script>
<style scoped>
.table{
  max-height: 600px !important;
}
.font-weight-light{
  color:#48a420  !important;
}

</style>
