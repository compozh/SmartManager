<template>
    <material-card
          color="#FF4560"
          title="Ошибки на сегодня"
        >
          <v-data-table
            :headers="headersError"
            :items="dataErrorForToday"
            hide-actions
            color=''
          >
            <template
              slot="headerCell"
              slot-scope="{ header }"
              class="table-header"
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
              <td>{{ item.ErrorMessage }}</td>
              <td class="text-xs-right">{{ item.Count }}</td>
            </template>
          </v-data-table>
        </material-card>
</template>
<script>
export default {
    data(){
        return{
            dataErrorForToday: [{
                Count:'',
                ErrorMessage:''
            }],
            headersError: [
        {
          sortable: false,
          text: 'Сообщение об ошибке',
          value: 'ErrorMessage',
        },
        {
          sortable: false,
          text: 'Кол-во',
          value: 'Count',
          align: 'right'

        }
        ],
        }
    },
    methods:{
        GetErrorToday(){
            this.dataErrorForToday=[];
            for(var key in this.errorsForToday){
               this.dataErrorForToday.push(this.errorsForToday[key]);
            }
        }
    },
    computed: {
        errorsForToday(){
            return this.$store.getters.getInfoList.ErrorsForToday
        }
    },
    watch:{
        errorsForToday:function () {
           this.GetErrorToday();
        }
    },
}
</script>
<style scoped>
.font-weight-light{
  color:#FF4560  !important;
}
</style>
