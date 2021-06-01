<template>
  <v-card class="pa-2" ripple elevation="1"
          :to="{name: 'task-details', params: {taskId: task.id}}">
      <div class="item-title">
        <div class="item-title-desc text-truncate">
          <div v-if="!task.isRead"  class="isRead-icon"></div>
          <div class="column-element">

            <span :class="`ma-0 ${pl}-1 subtitle-1 task-doc-caption text-truncate d-inline-block`">
              {{ task.docCaption || task.descript }}</span>

            <span v-if="task.docText"
                  :class="`ma-0 ${pl}-1 subtitle-2 text--secondary doc-text text-truncate d-inline-block`">
              {{ task.docText }}</span>
          </div>
        </div>
        <div class="align-center justify-end icons-block">
          <fa-icon v-show="task.caseId" :class="`${ml}-2 blue-grey--text`" icon="suitcase"/>
          <fa-icon v-show="task.hasComm" :class="`${ml}-2`" icon="comment-alt-lines"/>
          <fa-icon v-show="task.hasOrig" :class="`${ml}-2 brown--text`" icon="paperclip"/>
          <fa-icon v-show="task.isFavorite" :class="`${ml}-2 blue--text text--lighten-2`" icon="star"/>
          <fa-icon v-show="task.isGenerated" :class="`${ml}-2`" icon="layer-plus"/>
          <fa-icon v-show="task.myControl" :class="`${ml}-2 indigo--text`" icon="eye"/>
        </div>
      </div>
      <v-divider class="mx-2"/>
      <div class="item-body">
        <div class="row-element">
          <v-avatar color="grey lighten-1" class="mx-3" size="40px">
            <fa-icon v-if="!user.photo" icon="user" inverse/>
            <v-img v-else :src="user.photo"/>
          </v-avatar>
          <div class="column-element">
            <span class="body-2 text--secondary">{{ user.name }}</span>
            <span :class="`ma-0 ${pl}-0 subtitle-1 d-flex align-center`">
              <fa-icon v-show="task.priority === 1"
                       :class="`red--text ${mr}-1`"
                       icon="fire"/>
              <span :class="`ma-0 ${pl}-0 pt-1 subtitle-2 text-truncate`">{{ task.name }}</span>
            </span>
            <div v-if="task.role || task.childCount > 0"
                 class="item-status"
                 :style="`padding-${isRight}: 5px;`">
              <div class="declarer-role" v-if="task.role">
                <span v-show="task.role === 'COEXECUTOR'" class="body-2">{{$t('tasks.coexecutor')}}</span>
                <span v-show="task.role === 'CONTROLER'" class="red--text body-2">{{  $t('tasks.controler') }}</span>
                <span v-show="task.role === 'EXECUTOR'" class="blue--text body-2">{{ $t('tasks.executor') }}</span>
                <span v-show="task.role === 'INITIATOR'" class="red--text body-2">{{ $t('tasks.initiator')  }}</span>
                <span v-show="task.role === 'INFORM'" class=" text--secondary body-2">{{$t('tasks.inform') }}</span>
              </div>
              <div class="task-status">
              <span v-show="task.childCount > 0 && task.childCount !== task.childDoneCount && task.role !== 'INITIATOR'"
                    class="body-2 text--secondary">
                <fa-icon class="text--secondary" icon="hourglass"/>
                {{$t('tasks.childsAssigned')}}
              </span>
                <span v-show="task.childCount > 0 && task.childCount === task.childDoneCount && task.role !== 'INITIATOR'"
                      class="green--text body-2">
                <fa-icon class="green--text" icon="check-double"/>
                {{$t('tasks.childsDone')}}
              </span>
                <span v-show="task.role === 'INITIATOR'" class="red--text body-2">
                <fa-icon class="red--text" icon="reply"/>
                {{$t('tasks.returnedInitiator')}}
              </span>
              </div>
            </div>
          </div>
        </div>
        <div class="task-times">
          <span v-if="taskInProgress"
                class="body-2 mb-0"
                :class="overdue ? 'red--text' : 'blue--text'">
            {{ task.dateplan.includes('01.01.0001')
                ? $t('pickers.noTimeLimit')
                : toLocalString(task.dateplan) }}
          </span>
          <span v-if="taskIsDone" class="body-2 mb-0 green--text">
            <fa-icon class="green--text" icon="check"/>
            {{ toLocalString(task.dateFact) }}
          </span>
          <span v-if="taskIsDone && overdue" class="body-2 mb-0 red--text">
            <fa-icon class="red--text" icon="clock"/>
            {{ overdue }} {{$t('tasks.days')}}
          </span>
        </div>
      </div>
    </v-card>
</template>

<script>
import { date } from '@/mixins/dateTime'

export default {
  name: 'TaskListItem',
  mixins: [date],

  props: {
    task: Object
  },
  computed: {
    user () {
      const userId = this.$store.getters.userId
      return userId === this.task.declarerId || userId === this.task.addedId
        ? { name: this.task.performer, photo: this.task.performerPhoto }
        : {
          name: this.task.declarer || this.task.addedFio,
          photo: this.task.declarerPhoto || this.task.addedPhoto
        }
    },
    taskInProgress () {
      return this.task.status === '' || this.task.status === '*'
    },
    taskIsDone () {
      return this.task.status === '+' || this.task.status === '#'
    },
    overdue () {
      const planDate = this.parseUtcDateTime(this.task.dateplan)
      const factDate = this.parseUtcDateTime(this.task.dateFact)
      if (planDate.isSameOrAfter(factDate)) {
        return false
      }
      return factDate.diff(planDate, 'days')
    }
  }
}
</script>

<style scoped>
  .isRead-icon {
    background: #2196f3;
    display: flex;
    margin-top: 9px;
    min-width: 12px;
    min-height: 12px;
    max-width: 12px;
    max-height: 12px;
    border-radius: 50%;
  }
  .item-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .task-doc-caption {
    line-height: 18px;
  }
  .item-title .icons-block {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    padding: 5px;
    min-width: 90px;
  }
  .icons-block svg {
    margin: 2px 0;
  }
  .item-title-desc {
    display: flex !important;
  }
  .doc-text {
    font-weight: 400;
    line-height: 16px;
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
    display: flex;
    align-items: center;
  }
  .task-times {
    display: flex;
    flex-direction: column;
    text-align: right;
    padding: 5px;
    min-width: 90px;
  }
  .row-element {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 2px 0;
    overflow: hidden;
  }
  .column-element {
    display: flex;
    flex-direction: column;
    padding: 8px 0;
    overflow: hidden;
  }

  .column-element .subtitle-1 {
    display: flex;
    align-items: flex-start;
  }
</style>
