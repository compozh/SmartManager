<template>
  <v-flex class="tasks-list-block">
    <div v-for="task in sortedTasks" :key="task.shiftTaskId">

      <div
        v-if="(selectedTasksTab == 0 && (task.state == 'IN_PLAN' || task.state == 'IN_WORK'))
        || (selectedTasksTab == 1 && task.state == 'DONE')"
      >

        <v-card ripple
          class="task-item"
          @click="changeCurrentTask(task)"
        >
        <v-icon v-if="task.inProgress" large class="inprogress-icon">play_arrow</v-icon>

          <v-card-text @click.stop="changeTaskTableView(false)"  @click="changeCurrentTask(task)" :class="selectedTask && task.shiftTaskId == selectedTask.shiftTaskId ? 'active-task-item' : 'inactive-task-item'">
            <span v-html="task.description"></span>
          </v-card-text>
          <v-card-actions v-if="$vuetify.breakpoint.smAndDown" >
            <!-- <v-menu offset-y>
              <template v-slot:activator="{on}">
                <v-btn text v-on="on" @blur="!on">
                  FUNCTIONS
                </v-btn>
              </template> -->
               <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header>FUNCTIONS</v-expansion-panel-header>
                    <v-expansion-panel-content>
                    <mes-task-main-layout-toolbar 
                      :inTasksTable='true'
                    />
                    </v-expansion-panel-content>
                  </v-expansion-panel></v-expansion-panels>
            <!-- </v-menu> -->
          </v-card-actions>
          <v-progress-linear v-if="task.completionPercentage"
            color="#326da8"
            height="22"
            :value="Math.round(task.completionPercentage)"
            reactive
          >
            {{Math.round(task.completionPercentage)}}%
          </v-progress-linear>

        </v-card>
      </div>
    </div>
  </v-flex>
</template>

<script>

export default {
  name: 'mes-task-cards',
  props: {
    selectedTask: Object,
    selectedTasksTab: Number
  },
  computed: {
    tasks() {
      return this.$store.getters['mes/tasks']
    },
    filterValue() {
      return this.$store.getters['mes/filterValue']
    },
    sortedTasks() {
      let tasks,
        filteredTasks = this.tasks.filter(task => {
          return (!this.filterValue || task.description.toLowerCase().includes(this.filterValue.toLowerCase())) ? task : null
        })

      tasks = filteredTasks.sort((a,b) => {
        let aStartDateTime = new Date(a.startDateTime).getTime(),
          bStartDate = new Date(b.startDateTime).getTime(),
          sortByDate = aStartDateTime > bStartDate ? 1 : (aStartDateTime == bStartDate ? 0 : -1)

        return a.inProgress && b.inProgress ? sortByDate : a.inProgress ? -1 : b.inProgress ? 1 : sortByDate
      })

      return tasks
    }
  },
  methods: {
    changeCurrentTask(newTask) {
      this.$emit('changeCurrentTask', newTask)
    },
    changeTaskTableView() {
      this.$emit('changeTaskTableView', false)
    },
  }
}
</script>

<style type="text/css" scoped>
  .tasks-list-block {
    display: flex;
    width: 100%;
    flex-direction: column;
  }
  .active-task-item {
    background-color: #d5e5ff;
  }
  .tasks-list-blocks .task-item{
    margin: 5px 10px;
    cursor: pointer;
    text-align: center;
  }
  .inprogress-icon {
    position: absolute;
    left: 0;
    top: 0;
    color: rgba(7, 109, 0, 0.81);
  }
</style>
<style>
  .v-expansion-panel-content__wrap{
  padding: 10px;
}
</style>