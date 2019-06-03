import {eventBus} from "../../../main";

export default {
  name: 'smTaskInfoRl',
  props: ['taskinfo'],

  data: () => ({
    menu: {
      tabs: [
        { name: 'Задачи', value: 'tasks', component: 'sm-task-tab-tasks' },
        { name: 'Обсуждения', value: 'comments', component: 'sm-task-tab-comments' },
        { name: 'Связанные документы', value: 'docs', component: 'sm-task-tab-docs' },
        { name: 'История', value: 'history', component: 'sm-task-tab-history' }
      ],
      activeTab: null
    }
  }),
  computed: {
    taskDetail() {
      const smTasksInfo = this.$store.getters.getAppData("SMTASKINFO")
      if (smTasksInfo && smTasksInfo.data) {
        return smTasksInfo.data.smtasks.tasksGetInfo;
      }
      return {}
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


