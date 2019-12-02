<template>
  <router-link :to="{name: 'case-view', params: {id: caseItem.id}}"
               class="task__task-item task__opened-task block sm:px-4 px-2 py-3">
    <!-- CASE ROW 1 : META -->
    <div class="flex w-full items-center">
      <vs-avatar class="sender__avatar flex-shrink-0 mr-3 border-2 border-solid border-white"
                 icon="card_travel"
                 size="40px"/>
      <div class="flex justify-between items-start" style="width: calc(100% - 58px);">
        <div class="task__details truncate mr-3">
          <h5 class="mb-1">{{ caseItem.name }}</h5>
          <h6 class="text-primary">{{ caseItem.purpose }}</h6>
        </div>
        <div class="vx-col sm:w-1/5 w-full flex sm:flex-col
                    items-center sm:justify-end">
          <span v-if="dateFrom" class="flex self-end"
          >{{ $t('cases.dateFrom') }}: {{ dateFrom }}</span>
          <span v-if="dateTo" class="flex self-end"
          >{{ $t('cases.dateTo') }}: {{ dateTo }}</span>
        </div>
      </div>

    </div>

    <!-- CASE ROW 2 : MSG & ACTIONS -->
    <div class="flex w-full" style="padding-left: 45px; color: #9c9c9c;">
      <div class="task__message truncate mx-3">
        <span class="mr-2">{{ $t('cases.dateAdd') }}: {{ caseItem.dateAdd }}</span>
        <span>{{ $t('cases.fioAdd') }}: {{ caseItem.fioAdd }}</span>
      </div>
      <vs-spacer></vs-spacer>

      <vx-tooltip :text="$t('icons.attachments')" color="rgb(98, 98, 98, .95)">
        <feather-icon v-if="caseItem.hasOrig" icon="PaperclipIcon" class="mr-2"/>
      </vx-tooltip>

      <vx-tooltip :text="$t('icons.comment')" color="rgb(98, 98, 98, .95)">
        <feather-icon v-if="caseItem.hasComm" icon="MessageSquareIcon" class="mr-2"/>
      </vx-tooltip>

    </div>
  </router-link>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    caseItem: Object
  },
  computed: {
    date() {
      return date => {
        const formatDate = moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY')
        return formatDate === '01.01.0001' ? '' : formatDate
      }
    },
    dateFrom() {
      return this.date(this.caseItem.dateFrom)
    },
    dateTo() {
      return this.date(this.caseItem.dateTo)
    }
  }
}
</script>
