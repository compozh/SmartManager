<template>
  <router-link :to="{name: 'case-details', params: {caseId: caseItem.id}}"
               style="text-decoration: none">
    <v-card class="pa-2">
      <div class="item-title">
        <div class="item-title-desc text-truncate">
          <div class="column-element">
            <span class="subtitle-1 task-doc-caption text-truncate d-inline-block ma-0 pl-1">
              {{ caseItem.name }}</span>
          </div>
        </div>
        <div class="align-center justify-end icons-block">
          <fa-icon v-show="caseItem.hasComm" class="ml-2" icon="comment-alt-lines"/>
          <fa-icon v-show="caseItem.hasOrig" class="ml-2 brown--text" icon="paperclip"/>
        </div>
      </div>
      <v-divider class="mx-2"/>
      <div class="item-body">
        <div class="row-element">
          <v-avatar color="grey lighten-1" class="mx-3" size="40px">
            <fa-icon icon="suitcase" inverse/>
          </v-avatar>
          <div class="column-element">
            <span class="body-2 text--secondary">{{ caseItem.fioAdd }}</span>
            <span class="ma-0 pl-0 subtitle-1 d-flex align-center">
              <span class=" ma-0 pl-0 pt-1 subtitle-2 text-truncate">{{ caseItem.purpose }}</span>
            </span>
          </div>
        </div>
        <div class="case-times">
          <span v-if="caseInProgress"
                class="body-2 mb-0"
                :class="overdue ? 'red--text' : 'blue--text'">
            {{ caseItem.dateTo }}</span>
          <span v-if="caseIsDone" class="body-2 mb-0 green--text">
            <fa-icon class="green--text" icon="check"/>
            {{ caseItem.dateTo }}
          </span>
          <span v-if="caseIsDone && overdue" class="body-2 mb-0 red--text">
            <fa-icon class="red--text" icon="clock"/>
            {{ overdue }} {{$t('tasks.days')}}
          </span>
        </div>
      </div>
    </v-card>
  </router-link>
</template>

<script>
import moment from 'moment'

export default {
  name: 'CaseListItem',
  props: {
    caseItem: Object
  },
  computed: {
    caseInProgress () {
      return this.caseItem.status === '' || this.caseItem.status === '*'
    },
    caseIsDone () {
      return this.caseItem.status === '+' || this.caseItem.status === '#'
    },
    overdue () {
      const planDate = moment(this.caseItem.dateTo, 'DD.MM.YYYY HH:mm').format()
      if (new Date(planDate).getTime() >= new Date().getTime()) {
        return false
      }
      return moment().diff(moment(planDate), 'days')
    }
  }
}
</script>

<style scoped>

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

  .item-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .item-status div {
    padding-right: 5px;
    display: flex;
    align-items: center;
  }

  .case-times {
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
