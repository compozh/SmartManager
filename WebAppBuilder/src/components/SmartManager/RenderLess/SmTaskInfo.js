import {eventBus} from "../../../main";
import gql from 'graphql-tag'
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
    },
    infoAboutTask:null
  }),
  apollo : {
    infoAboutTask:{
      query : gql`
      query taskInfoQUery($taskId: Int!){
        smtasks{
          tasksGetInfo(taskId: $taskId){
            id arso name status addedId dateAdd isAgree addedFio comments { date text user } dateFact dateplan  descript keyValue priority originals { id comm date file ndor user fileName typeName typeDescription } addedPhoto dateRemind docPlandate
          }
        }
      }`,
      // Параметр
      variables() {
        return{
          taskId : this.$route.params.taskId
        }
      },
       update(data){
        return data
      }
    },
  },
  computed: {
    taskDetail() {
      const smTasksInfo = this.infoAboutTask
      if (smTasksInfo) {
        return smTasksInfo.smtasks.tasksGetInfo;
      }
      return {}
    }
  },
  methods: {
    getCommentsCount(taskInfo) {
      for (let obj in this.menu.tabs) {
        if (this.menu.tabs[obj].value === 'comments') {
          this.menu.tabs[obj].count = taskInfo.comments.length
        }
      }
      console.log('', )
    },
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


