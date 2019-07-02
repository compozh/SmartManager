import {eventBus} from '../../../main'
import gql from 'graphql-tag'
export default {
  name: 'smTaskInfoRl',
  data: () => ({
    tabs: [
      {name: 'Задачи', value: 'tasks', component: 'sm-task-tab-tasks'},
      {name: 'Документы', value: 'originals', component: 'sm-task-tab-docs'},
      {name: 'Обсуждения', value: 'comments', component: 'sm-task-tab-comments'},
      {name: 'Согласования', value: 'agreement', component: 'sm-task-tab-agree'}
    ],
    activeTab: {
      value: null
    },
    infoAboutTask: null
  }),
  apollo: {
    infoAboutTask: {
      query: gql`
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
          taskId: this.$route.params.taskId
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
        return smTasksInfo.smtasks.tasksGetInfo
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


