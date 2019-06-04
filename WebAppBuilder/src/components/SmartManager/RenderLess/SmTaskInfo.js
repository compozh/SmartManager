import {eventBus} from "../../../main";

export default {
  name: 'smTaskInfoRl',
  data: () => ({
    tabs: [
      {name: 'Задачи', value: 'tasks', component: 'sm-task-tab-tasks'},
      {name: 'Связанные документы', value: 'originals', component: 'sm-task-tab-docs'},
      {name: 'Обсуждения', value: 'comments', component: 'sm-task-tab-comments'},
      {name: 'Согласования', value: 'agreement', component: 'sm-task-tab-agree'}
    ],
    activeTab: {
      value: null
    }
  }),
  computed: {
    taskDetail() {
      const smTasksInfo = this.$store.getters.getAppData("SMTASKINFO")
      if (smTasksInfo && smTasksInfo.data) {
        return smTasksInfo.data.smtasks.tasksGetInfo
      }
      return {}
    },
    getNotEmptyTabs() {
      const taskObj = this.taskDetail
      if (taskObj.id) {
        return this.tabs.filter(i => {
          // вкладка с комментариями отображается всегда
          if (i.value === 'comments') {
            return true
          }
          // остальные вкладки кроме "согласования" отображаются если есть данные
          if (taskObj[i.value]
            && taskObj[i.value].length
            && taskObj[i.value] !== 'agreement') {
            return true
          }
          // вкладка "согласования" отображается если есть хоть один согласующий коментарий
          if (i.value === 'agreement') {
            return taskObj.comments.some(i => i === 'isAgree' && i === '+')
          }
        })
      }
    }
  },
  methods: {
    loadDataForComponents() {
      const datasource = {
        query: `{ smtasks { tasksGetInfo(taskId:${this.$route.params.taskId}) { id arso name status addedId dateAdd isAgree addedFio comments { date text user } dateFact dateplan  descript keyValue priority originals { id comm date file ndor user fileName typeName typeDescription } addedPhoto dateRemind docPlandate }}} `,
        schema: "SMARTMANAGER"
      }
      const key = "SMTASKINFO"
      this.$store.dispatch("LoadDataForComponent", {
        datasource,
        key
      });
    },
    // Функция для обновления данных при изменении роутинга
    beforeRouteUpdate(to, from, next) {
      this.loadDataForComponents();
    },
  },
  beforeMount() {
    this.loadDataForComponents();
  },
  updated() {
    //eventBus.$emit('setMenuMiniMode', true);
  },
  render() {
    return this.$scopedSlots.default({
      activeTab: this.activeTab,
      tabs: this.getNotEmptyTabs,
      task: this.taskDetail,
      props: {}
    })
  }
}


