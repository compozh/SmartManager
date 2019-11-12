<template>
  <div
    class="task__task-item sm:px-4 px-2 py-3"
    @click="caseLink(caseItem.id)"
  >
    <!-- TASK ROW 1 : META -->
    <div class="flex w-full items-center" style="padding-left: 45px;">
      <div class="flex justify-between items-start w-full">
        <div class="task__details truncate m-3">
          <h5 class="mb-1">{{ caseItem.name }}</h5>
          <h6 class="text-primary">{{ caseItem.purpose }}</h6>
        </div>

        <div class="task-item__meta flex m-3">
          <span class="mr-2">{{ $t('cases.dateFrom') }}: {{ date(caseItem.dateFrom) }}</span>
          <span>{{ $t('cases.dateTo') }}: {{ date(caseItem.dateTo) }}</span>
        </div>
      </div>
    </div>

    <!-- TASK ROW 2 : MSG & ACTIONS -->
    <div class="flex w-full" style="padding-left: 45px;">
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
  </div>
</template>

<script>
export default {
  props: {
    caseItem: {
      type: Object,
      required: true,
    }
  },
  computed: {
    date() {
      return dateTime => dateTime
        ? dateTime.split(' ').shift()
        : ''
    },
    comments() {
      return this.case.comments ? this.case.comments.length : 0
    }
  },
  methods: {
    caseLink(id) {
      this.$router.push({name: 'case-view', params: {id}})
    }
  }
}
</script>
