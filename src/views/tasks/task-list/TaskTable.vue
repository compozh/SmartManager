<template>
  <perfect-scrollbar tag="v-row" :options="scrollOptions">
    <v-col>
      <v-data-table
        :headers="headers"
        fixed-header
        :items="tasks"
        :items-per-page="15"
        class="elevation-1 body-2"
        style="font-size: 10px"
        min-width= '90px'
        :footer-props="footerProps"
        @click:row="item => rowClick(item)">

        <!-- TASK STATUS -->
        <template #item.status="{ item }">
          <v-chip x-small label outlined
                  :color="taskStatus(item).color">
            <fa-icon :icon="taskStatus(item).icon" :class="`${mr}-3`"/>
            {{ taskStatus(item).text }}
          </v-chip>
        </template>

        <!-- ADDED FIO -->
        <template #item.addedFio="{ item }">
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-avatar v-on="on" color="grey lighten-1" size="40px">
                <fa-icon v-if="!item.addedPhoto" icon="user" inverse/>
                <v-img v-else :src="item.addedPhoto"/>
              </v-avatar>
            </template>
            <span>{{item.addedFio}}</span>
          </v-tooltip>
        </template>

        <!-- TASK NAME -->
        <template #item.name="{ item }">
          <span :class="{ 'font-weight-bold': !item.isRead }">{{item.name}}</span>
        </template>

        <!-- USER ROLE -->
        <template #item.role="{ item }">
          <span :class="{ 'font-weight-bold': !item.isRead }">
            {{item.role ? $t('tasks.' + item.role.toLowerCase()) : '---'}}
          </span>
        </template>

        <!-- DOC CAPTION -->
        <template #item.docCaption="{ item }">
          <span :class="{'font-weight-bold': !item.isRead}">{{item.docCaption}}</span>
        </template>

        <!-- DATE PLAN -->
        <template #item.dateplan="{ item }">
          <span :class="{'font-weight-bold': !item.isRead}">{{item.dateplan}}</span>
        </template>

        <!-- DATE FACT -->
        <template #item.dateFact="{ item }">
          <span v-if="!taskInProgress(item)"
                :class="{'font-weight-bold': !item.isRead}">
            {{item.dateFact}}</span>
          <span v-else>---</span>
        </template>

        <!-- HAS ATTACHMENTS -->
        <template #item.hasOrig="{ item }">
          <fa-icon v-show="item.hasOrig"
                   icon="paperclip"
                   :class="`${ml}-2 brown--text`"/>
        </template>

        <!-- NO TASKS -->
        <template #no-data>
          <div :class="`primary--text body-2 ${ml}-3 mt-3`">{{ $t('tasks.noTasks') }}</div>
        </template>
      </v-data-table>
    </v-col>
  </perfect-scrollbar>
</template>

<script>
export default {
  name: 'TaskTable',
  props: {
    tasks: Array
  },

  data: () => ({
    scrollOptions: {
      wheelSpeed: 0.3,
      suppressScrollX: true
    }
  }),

  computed: {
    footerProps () {
      return {
        itemsPerPageOptions: [15, 25, 50, -1],
        itemsPerPageText: this.$t('tasks.perPage')
      }
    },

    headers () {
      return [
        { text: this.$t('tasks.status'), align: 'center', value: 'status', class: 'grid-headers' },
        { text: this.$t('tasks.from'), align: 'start', value: 'addedFio', class: 'grid-headers' },
        { text: this.$t('tasks.content'), align: 'start', sortable: false, value: 'name', class: 'grid-headers' },
        { text: this.$t('tasks.role'), align: 'start', value: 'role', class: 'grid-headers' },
        { text: this.$t('tasks.source'), align: 'start', value: 'docCaption', class: 'grid-headers' },
        { text: this.$t('tasks.planDate'), align: 'start', value: 'dateplan', class: 'grid-headers' },
        { text: this.$t('tasks.actualDate'), align: 'start', value: 'dateFact', class: 'grid-headers' },
        { text: this.$t('tasks.hasOrig'), align: 'start', value: 'hasOrig', class: 'grid-headers' }
      ]
    },

    taskStatus () {
      return task => {
        switch (task.status) {
          case '':
          case '*':
            return {
              color: 'primary',
              icon: 'recycle',
              text: this.$t('statuses.inProgress')
            }
          case '-':
            return {
              color: 'error',
              icon: 'exclamation-circle',
              text: this.$t('statuses.rejected')
            }
          case '+':
            return {
              color: 'success',
              icon: 'check-circle',
              text: this.$t('statuses.done')
            }
          case '#':
            return {
              color: 'yellow darken-2',
              icon: 'file-search',
              text: this.$t('statuses.review')
            }
          default:
            return {
              color: 'grey',
              icon: 'times',
              text: this.$t('statuses.undefined')
            }
        }
      }
    }
  },

  methods: {
    taskInProgress (task) {
      return task.status === '' || task.status === '*'
    },

    rowClick (item) {
      if (!item.id) {
        return
      }
      this.$router.push({ name: 'task-details', params: { taskId: item.id } })
    }
  }
}
</script>

<style scoped>

  /* Set pagination to left */
  .v-data-table >>> .v-data-footer {
    justify-content: flex-start;
    font-size: 14px;
  }

  .v-data-table >>> tr {
    cursor: pointer;
  }

</style>
