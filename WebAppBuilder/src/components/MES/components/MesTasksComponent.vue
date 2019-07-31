<template>
  <v-card>
    <v-layout column >
        <v-flex fill-height class="progress-toolbar">
          <v-tabs fixed-tabs>
              <v-tab :key=taskStatus.inPlan.id
            @click="changeStatus(taskStatus.inPlan.id)"
            >
              {{taskStatus.inPlan.name}}
          </v-tab>
              <v-tab :key=taskStatus.done.id
            @click="changeStatus(taskStatus.done.id)"
            >
              {{taskStatus.done.name}}
          </v-tab>
        </v-tabs>
      </v-flex>
      <v-flex class="list-block">
        <v-card class="card"
        v-for="task in tasks"
        :key="task.id"
        @click="onCardClick(task.id)"
        >
          <div v-if="(currentStatus == taskStatus.inPlan.id && task.state == taskStatus.inWork.id) || currentStatus == task.state">
            <v-card-text>{{task.description}}</v-card-text>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-tasks-component",
  data: function() {
    return { currentStatus: 'IN_PLAN' };
  },
    created(){
        this.initializeTasks();
    },
    computed: {
        tasks() {
            console.log(this.$store.getters['mes/tasks']);
            return this.$store.getters['mes/tasks'];  
        },
        workCenter(){
            return this.$store.getters['mes/workCenters'];
        },
        taskStatus() {
            return {
            inPlan: {name:'В плане', id: 'IN_PLAN'},
            inWork: {name: 'В работе', id: 'IN_WORK'},
            done: {name:'Выполнено', id: 'DONE'}
            };
        }
    },
    methods:{
        async initializeTasks(){
            await this.setupWorkCenters("QU9V0+AJ26LAGNLFGXLKIK6NM322NQSQ82EQ8PINQJ4=", "");
            this.setupTasksByWorkCenter(this.workCenter[0].code);
        },
        async setupWorkCenters(uuid, login) {
            const loader = 'setCircularLoader';
            await this.$store.dispatch('mes/setupWorkCenters', {uuid, loader});
        },
        setupTasksByWorkCenter(workCenter) {
        this.$store.dispatch('mes/setupTasks', {workCenter});
        },
        changeStatus(status) {
            this.currentStatus = status;
        }
    }
}
</script>

<style type="text/css" scoped>
  .main-block {
  }
  .progress-toolbar{
  }
  .list-block .card{
    margin: 10px;
    border-radius: 50px;
  }
</style>