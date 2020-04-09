<template>
  <router-link :to="{name: 'task-details', params: {taskId: task.id}}"
               tag="v-card" :style="cardStyle">
    <div class="item-title">
      <div class="item-title-desc">
        <fa-icon v-if="!task.isRead" class="blue--text isRead-icon" :icon="['fal', 'dot-circle']"/>
        <div class="column-element">
          <span class=" ma-0 pl-1 subtitle-1">{{ task.docCaption || task.descript }}</span>
          <span v-if="task.docText" class=" ma-0 pl-1 subtitle-2 text--secondary">{{ task.docText }}</span>
        </div>
      </div>
      <div class="align-center justify-end icons-block">
        <fa-icon v-show="task.caseId" class="ml-2 blue-grey--text" :icon="['fal', 'suitcase']"/>
        <fa-icon v-show="task.hasCom" class="ml-2" :icon="['fal', 'comment-alt-lines']"/>
        <fa-icon v-show="task.hasOrig" class="ml-2 brown--text" :icon="['fal', 'paperclip']"/>
        <fa-icon v-show="task.isFavorite" class="ml-2 blue--text text--lighten-2" :icon="['fal', 'star']"/>
        <fa-icon v-show="task.isGenerated" class="ml-2 " :icon="['fal', 'layer-plus']"/>
        <fa-icon v-show="task.isMy" class="ml-2 orange--text" :icon="['fal', 'portrait']"/>
        <fa-icon v-show="task.myControl" class="ml-2 indigo--text" :icon="['fal', 'eye']"/>
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
          <span class="ma-0 pl-0 subtitle-1">
            <fa-icon v-show="task.priority === 1" class="red--text" :icon="['fal', 'fire']"/>
            {{ task.name }}
          </span>
          <div class="item-status">
            <div class="declarer-role">
              <span v-show="task.role === 'COEXECUTOR'" class="caption">{{$t('tasks.coexecutor')}}</span>
              <span v-show="task.role === 'CONTROLER'" class="red--text caption">{{  $t('tasks.controler') }}</span>
              <span v-show="task.role === 'EXECUTOR'" class="blue--text caption">{{ $t('tasks.executor') }}</span>
              <span v-show="task.role === 'INITIATOR'" class="red--text caption">{{ $t('tasks.initiator')  }}</span>
              <span v-show="task.role === 'INFORM'" class=" text--secondary caption">{{$t('tasks.inform') }}</span>
            </div>
            <div class="task-status">
              <span v-show="task.childCount > 0 && task.childCount !== task.childDoneCount && task.role !== 'INITIATOR'"
                    class="caption text--secondary">
                <fa-icon class="text--secondary" :icon="['fal', 'hourglass']"/>
                {{$t('tasks.childsAssigned')}}
              </span>
              <span v-show="task.childCount > 0 && task.childCount === task.childDoneCount && task.role !== 'INITIATOR'"
                    class="green--text caption">
                <fa-icon class="green--text" :icon="['fal', 'check-double']"/>
                {{$t('tasks.childsDone')}}
              </span>
              <span v-show="task.role === 'INITIATOR'" class="red--text caption">
                <fa-icon class="red--text" :icon="['fal', 'reply']"/>
                {{$t('tasks.returnedInitiator')}}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="task-times">
        <span v-if="taskInProgress"
              class="caption mb-0"
              :class="overdue ? 'red--text' : 'blue--text'">
          {{ task.dateplan }}</span>
        <span v-if="taskIsDone" class="caption mb-0 green--text">
          <fa-icon class="green--text" :icon="['fal', 'check']"/>
          {{ task.dateFact }}
        </span>
        <span v-if="taskIsDone && overdue" class="caption mb-0 red--text">
          <fa-icon class="red--text" :icon="['fal', 'clock']"/>
          {{ overdue }} {{$t('tasks.days')}}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script>
import moment from 'moment'
export default {
  name: 'TaskListItem',
  props: {
    task: Object
  },
  data: () => ({}),
  computed: {
    taskInProgress () {
      return this.task.status === '' || this.task.status === '*'
    },
    taskIsDone () {
      return this.task.status === '+' || this.task.status === '#'
    },
    overdue () {
      const planDate = moment(this.task.dateplan, 'DD.MM.YYYY HH:mm').format()
      const factDate = moment(this.task.dateFact, 'DD.MM.YYYY HH:mm').format()
      if (new Date(planDate).getTime() >= new Date(factDate).getTime()) {
        return false
      }
      return moment(factDate).diff(moment(planDate), 'days')
    },
    cardStyle () {
      return {
        padding: '5px',
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderLeftColor: this.task.status === '' ? '#43A047' : '#FF5722',
        borderRightColor: this.task.isRead ? 'grey' : '#009688'
      }
    }
  }
}
</script>

<style scoped>
  .isRead-icon {
    margin-top: 4px;
  }
  .item-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .item-title .icons-block {
    padding: 5px;
  }
  .item-title-desc {
    display: flex;
  }
  .item-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .item-status {
    display: flex;
  }
  .item-status div {
    padding-right:5px;
  }
  .task-times {
    display: flex;
    flex-direction: column;
    text-align: right;
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
