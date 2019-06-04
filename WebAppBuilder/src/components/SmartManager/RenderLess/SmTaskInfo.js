import {eventBus} from "../../../main";

export default {
  name: 'smTaskInfoRl',
  props: ['taskinfo'],

  data: () => ({
    menu: {
      tabs: [
        { name: 'Задачи', value: 'tasks', component: 'sm-task-tab-tasks', count: 0 },
        { name: 'Обсуждения', value: 'comments', component: 'sm-task-tab-comments', count: 0 },
        { name: 'Связанные документы', value: 'docs', component: 'sm-task-tab-docs', count: 0 },
        { name: 'История', value: 'history', component: 'sm-task-tab-history', count: 0 }
      ],
      activeTab: null
    }
  }),
  computed: {
    taskDetail() {
      const smTasksInfo = this.$store.getters.getAppData("SMTASKINFO")
      if (smTasksInfo && smTasksInfo.data) {
        let taskInfo = smTasksInfo.data.smtasks.tasksGetInfo;
        this.getCommentsCount(taskInfo)
        return taskInfo
      }
      return {}
    },
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
    getCommentsCount(taskInfo) {
      for (let obj in this.menu.tabs) {
        if (this.menu.tabs[obj].value === 'comments') {
          this.menu.tabs[obj].count = taskInfo.comments.length
        }
      }
      console.log('', )
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
    eventBus.$emit('setMenuMiniMode', true);
  },
  render() {
    return this.$scopedSlots.default({
      menu: this.menu,
      task: this.taskDetail,
      props: {

      }
    })
  }
}


