<template>
  <v-card>
    <v-layout column>
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
        <div v-if="!initializeTasks" class="wait-for-data-block">
          <ContentLoader>
            <rect x="0" y="0" rx="3" ry="3" width="250" height="10" />
            <rect x="20" y="20" rx="3" ry="3" width="220" height="10" />
            <rect x="20" y="40" rx="3" ry="3" width="170" height="10" />
            <rect x="0" y="60" rx="3" ry="3" width="250" height="10" />
            <rect x="20" y="80" rx="3" ry="3" width="200" height="10" />
            <rect x="20" y="100" rx="3" ry="3" width="80" height="10" />
          </ContentLoader>
        </div>
        <v-card class="card"
        v-for="task in tasks"
        :key="task.id"
        @click="changeCurrentTask(task)"
        >
          <div v-if="(currentStatus == taskStatus.inPlan.id && task.state == taskStatus.inWork.id) || currentStatus == task.state">
          <v-card-text><span v-html="task.description"></span></v-card-text>
          </div>
        </v-card>
        <span v-if="initializeTasks && !tasks.length" class="lack-of-tasks-str">Задания отсутствуют</span>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import {ContentLoader} from '../../../../node_modules/vue-content-loader'

export default {
  name: "mes-tasks-component",
  components: {
    ContentLoader
  },
  data: function() {
    return { currentStatus: 'IN_PLAN', initializeTasks: false};
  },
  props: {
    selectedTask: Object
  },
    created(){
        this.initTasks();
    },
    computed: {
        tasks() {
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
        async initTasks(){
            await this.setupWorkCenters("QU9V0+AJ26LAGNLFGXLKIK6NM322NQSQ82EQ8PINQJ4=", "");
            await this.setupTasksByWorkCenter(this.workCenter[0].code);
            var tasks = this.tasks;
            this.initializeTasks = true;

            if(this.tasks && this.tasks.length){
              this.changeCurrentTask(this.tasks[0]);
              this.initializeInProcess = false;
            }
        },
        async setupWorkCenters(uuid, login) {
            const loader = 'setCircularLoader';
            await this.$store.dispatch('mes/setupWorkCenters', {uuid, loader});

        },
        async setupTasksByWorkCenter(workCenter) {
          await this.$store.dispatch('mes/setupTasks', {workCenter});
        },
        changeStatus(status) {
            this.currentStatus = status;
        },
        changeCurrentTask(newTask) {
          this.$emit('changeCurrentTask', newTask);
        }
    }
}
</script>

<style type="text/css" scoped>
  .list-block {
    overflow: auto;
    height: 89vh;
  }
  .list-block .card{
    margin: 10px;
    border-radius: 50px;
  }
  .lack-of-tasks-str {
    font-size: 1.5em;
    font-weight: 300;
    color: #3d83f7;
  }
  .wait-for-data-block {
    padding: 20px;
  }
</style>