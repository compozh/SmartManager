import gql from 'graphql-tag'
export default {
  name: 'smTaskInfoRl',
  props: ['taskinfo'],

  data: () => ({
    menu: {
      tabs: [
        'Задачи', 'Обсуждения', 'Связанные документы', 'История'
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
  render() {
    return this.$scopedSlots.default({
      menu: this.menu,
      task: this.taskDetail,
      props: {

      }
    })
  }
}


