<template>
    <material-card
          color="#008FFB"
          title="Планировщик"
        >
          <v-data-table
            :headers="headers"
            :items="dataSchedulerFails"
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
              <td>{{ item.TaskCode }}</td>
              <td class="text-xs-center">{{ item.TaskName }}</td>
              <td class="text-xs-right">{{ item.Result }}</td>
            </template>
          </v-data-table>
        </material-card>
</template>

<script>
export default {
    data(){
        return{
            dataSchedulerFails: [{
                result: '',
                taskCode: '',
                taskName: '',
            }],
            headers: [{
                sortable: false,
                text: 'Код',
                value: 'taskCode'
            },{
                sortable: false,
                text: 'Наименование',
                value: 'taskName',
                align: 'center'
            },{
                sortable: false,
                text: 'Результат',
                value: 'result',
                align: 'right'

            }],
        }
    },
    computed:{
        schedulerFails(){
            return this.$store.getters.getInfoList.SchedulerFails
        }
    },
    methods:{
        GetSchedulerFails(){
            this.dataSchedulerFails=[];
            for(var key in this.schedulerFails){
                this.dataSchedulerFails.push(this.schedulerFails[key]);
            }
        }
    },
    watch:{
        schedulerFails:function(){
        this.GetSchedulerFails();
      }
    }
    

}
</script>

<style scoped>
.font-weight-light{
  color:#008FFB  !important;
}
</style>
