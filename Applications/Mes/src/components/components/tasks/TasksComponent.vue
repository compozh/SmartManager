<template>
  <div class="mes-tasks-component">
      <v-layout column class="mes-tasks-component-layout" scrollable>
        <v-flex fill-height class="grid-tabs">
          <v-tabs v-model="selectedTab">
            <v-tab v-for="tab in tabs" :key=tab.id @click="changeSelectTasksTab(tab.index)" class="toolbar-item">
              <v-badge color="#326DA8" overlap>
                <template v-slot:badge>
                  <span class="span-count-tasks">{{countTasks(tab.index)}}</span>
                </template>
                {{tab.name}}
              </v-badge>
            </v-tab>
          </v-tabs>
        </v-flex>
        <v-flex class="tasks-list-blocks">

          <mes-content-loader
            v-if="!initializeTasks && !tasks.length"
            :loaderType=loaderType
          />
          <v-text-field
            v-if="initializeTasks"
            class="search-field"
            :label="this.$t('mes.placeholders.SearchTask')"
            v-model="filterValue"
            clearable
          ></v-text-field>
    <vue-pull-refresh :on-refresh="onRefresh">
          <div class="tasks-list-block-content">

            <mes-task-cards
              :selectedTask=selectedTask
              :selectedTasksTab=selectedTasksTab
              @changeCurrentTask=changeCurrentTask
              @changeTaskTableView=changeTaskTableView
            />

          </div>
    </vue-pull-refresh>
          <span v-if="initializeTasks && !countTasks(selectedTasksTab)" class="lack-of-tasks-str">{{this.$t('mes.labels.NoTasks')}}</span>
        </v-flex>

      </v-layout>
  </div>
</template>

<script>
import VuePullRefresh from 'vue-pull-refresh'
export default {
  name: 'mes-tasks-component',
  components: {
    'vue-pull-refresh': VuePullRefresh
  },
  data() {
    return {
      tabs: [
        { index: 0, id: 'PLAN', name: this.$t('mes.tabs.InPlan')},
        { index: 1, id: 'DONE', name: this.$t('mes.tabs.Done')}
      ],
      loaderType: 'list',
      selectedTab: this.selectedTasksTab
    }
  },
  props: {
    initializeTasks: Boolean,
    selectedTasksTab: Number
  },
  computed: {
    tasks() {
      return this.$store.getters['mes/tasks']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    tasksPageState() {
      return this.$store.getters['mes/tasksPageState']
    },
    selectedTask: {
      get() {
        return this.$store.getters['mes/selectedTask']
      }
    },
    filterValue: {
      get() {
        return this.tasksPageState.filterValue
      },
      set(filterValue) {
        this.$store.commit('mes/setFilterValue', filterValue)
      }
    }
  },
  methods: {
    changeSelectTasksTab(tabIndex) {
      this.$emit('changeSelectTasksTab', tabIndex)
    },
    changeCurrentTask(newTask) {
      this.$emit('changeCurrentTask', newTask)
    },
    changeTaskTableView() {
      this.$emit('changeTaskTableView', false)
    },
    countTasks(tabIndex) {
      var me = this,
        tasks = []

      for (let task of me.tasks) {
        if ((tabIndex == 0 && (task.state == 'IN_PLAN' || task.state == 'IN_WORK')) || tabIndex == 1 && task.state == 'DONE') {
          tasks.push(task)
        }
      }
      return tasks.length
    }, 
    onRefresh() {
      return new Promise( async (resolve, reject) => {
        this.$store.dispatch('mes/initializeTasks', { workCenterCode: this.workCenter.code }).then(()=>{
          
          this.$store.commit('mes/setObsoluteDataTask', false)
          resolve()
        })
      })
    },
  },
  mounted() {
    let refreshLabel = document.querySelector('.pull-down-content--label')
    refreshLabel.innerText = this.$t('mes.labels.Wait')
  }
}
</script>

<style type="text/css" scoped>
  .mes-tasks-component {
    height: 100%;
    width: 30%;
    min-width: 330px
  }
  .mes-tasks-component-layout {
    height: 100%;
  }
  .grid-tabs{
    flex: 0 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-height: 63px;
    align-items: center;
    padding-left: 10px;
    border-bottom: 1px solid rgba(2, 2, 2, 0.08);
  }
  .grid-tabs .v-badge {
    padding-right: 10px;
  }

  .search-field {
    height: 45px;
  }
  .search-field .v-label {
    left: 5px !important;
  }
  .search-field .v-application .primary--text {
    color: #326da8 !important;
    caret-color: #326da8 !important;
  }
  .tasks-list-block-content {
    height:calc(100% - 109px);
    overflow-y: auto;
    position: absolute;
    width: 100%;
  }

  .tasks-list-block-content::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .v-card__text.active-task-item {
    border-top-left-radius: none !important;
    border-top-right-radius: none !important;
  }
  /* background of the scrollbar except button or resizer */
  .tasks-list-block-content::-webkit-scrollbar-track {
    background-color:#fff
  }
  .tasks-list-block-content::-webkit-scrollbar-track:hover {
    background-color:#f4f4f4
  }

  /* scrollbar itself */
  .tasks-list-block-content::-webkit-scrollbar-thumb {
    background-color:#babac0;
    border-radius:16px;
    border:5px solid #fff
  }
  .tasks-list-block-content::-webkit-scrollbar-thumb:hover {
    background-color:#a0a0a5;
    border:4px solid #f4f4f4
  }
  /* set button(top and bottom of the scrollbar) */
  .tasks-list-block-content::-webkit-scrollbar-button {display:none}

  .change-tasks-status-toolbar {
    padding-left: 5px;
  }
  .toolbar-item {
    margin: 0 10px;
    min-width: 135px;
  }
  .lack-of-tasks-str {
    display: flex;
    font-size: 2em;
    font-weight: 500;
    color: #3d83f7;
    opacity: 0.5;
    padding-left: 10px;
  }
  .wait-for-data-block {
    padding: 20px;
  }
  .span-count-tasks {
    font-size: 13px;
    font-weight: 400;
  }
</style>
