<template>
  <router-link :to="{name: 'task-details', params: {taskId: task.id}}"
               tag="v-card" :style="cardStyle">
    <div class="item-title">
      <div class="column-element">
        <span class=" ma-0 pl-1 subtitle-1">{{ task.docCaption || task.descript }}</span>
        <span v-if="task.docText" class=" ma-0 pl-1 subtitle-2 text--secondary">{{ task.docText }}</span>
      </div>
      <div class="align-center justify-end icons-block">
        <fa-icon v-if="task.caseId" class="ml-2 blue-grey--text" :icon="['fal', 'suitcase']"/>
        <fa-icon v-if="task.hasCom" class="ml-2" :icon="['fal', 'comment-alt-lines']"/>
        <fa-icon v-if="task.hasOrig" class="ml-2 brown--text" :icon="['fal', 'paperclip']"/>
        <fa-icon v-if="task.isFavorite" class="ml-2 blue--text text--lighten-2" :icon="['fal', 'star']"/>
        <fa-icon v-if="task.isGenerated" class="ml-2 " :icon="['fal', 'layer-plus']"/>
        <fa-icon v-if="task.isMy" class="ml-2 orange--text" :icon="['fal', 'portrait']"/>
        <fa-icon v-if="task.myControl" class="ml-2 indigo--text" :icon="['fal', 'eye']"/>
        <!-- <fa-icon v-if="task.priority" class="ml-2 red--text" :icon="['fal', 'exclamation-triangle']"/> -->
      </div>
    </div>
    <v-divider class="mx-2"></v-divider>
    <div class="item-body">
      <div class="row-element">
        <v-avatar color="grey lighten-1" class="mx-3" size="50px">
          <fa-icon v-if="!task.addedPhoto" :icon="['fal', 'user']" inverse/>
          <v-img v-else :src="task.addedPhoto"/>
        </v-avatar>
        <div class="column-element">
          <span class="body-2 text--secondary">{{ task.addedFio }}</span>
          <span class="ma-0 pl-0 subtitle-1"><fa-icon v-if="task.priority == 1" class="red--text" :icon="['fal', 'fire']"/> {{ task.name }} </span>
          <div>
          <span v-if="task.role == 'COEXECUTOR'" class="caption">{{$t('tasks.coexecutor')}} </span>
            <span v-if="task.role == 'CONTROLER'" class="red--text caption">{{$t('tasks.controler')}} </span>
            <span v-if="task.childCount > 0 && task.childCount != task.childDoneCount" class="caption text--secondary"><fa-icon class="text--secondary" :icon="['fal', 'hourglass']"/> {{$t('tasks.childsAssigned')}}</span>
            <span v-if="task.childCount > 0 && task.childCount == task.childDoneCount" class="green--text caption"><fa-icon class="green--text" :icon="['fal', 'check-double']"/> {{$t('tasks.childsDone')}} </span>
          </div>
        </div>
      </div>
      <div class="justify-end">
        <!-- {{this.asd(task.dateplan, task.dateFact)}} -->
        <p class="caption mb-0">{{ $t('tasks.deadline') }}: {{ task.dateplan }}</p>
        <p class="caption mb-0">{{ $t('tasks.done') }}: {{ task.dateFact }}</p>
      </div>
    </div>
  </router-link>
</template>

<script>
// import moment from 'moment'
export default {
  name: 'TaskListItem',
  props: {
    task: Object
  },
  data: () => ({}),
  computed: {
    cardStyle () {
      return {
        padding: '5px',
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderLeftColor: this.task.status === '' ? '#43A047' : '#FF5722',
        borderRightColor: this.task.isRead ? 'grey' : '#009688'
      }
    }
  },
  methods: {
    // asd (plan, fact) {
    //   debugger
    //   console.log(moment(plan, 'DD.MM.yyyy HH:mm').format())
    //   return fact
    // }
  }
}
</script>

<style scoped>
  .item-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .item-title .icons-block {
    padding: 5px;
  }
  .item-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .row-element {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 2px 0;
  }
  .column-element {
    display: flex;
    flex-direction: column;
  }
</style>
