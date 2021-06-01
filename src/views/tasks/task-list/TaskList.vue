<template>
  <!-- Task list -->
  <v-row no-gutters class="flex-column">
    <v-col class="flex-grow-0 d-flex align-center">
      <!-- Task search field -->
      <search-field :class="`mt-0 mb-1 ${pl}-1`"/>

      <v-spacer/>

      <!-- List/table view mode switch -->
      <v-btn-toggle v-model="viewMode"
                    class="transparent"
                    mandatory>
        <v-btn small>
          <fa-icon icon="list-alt" size="lg"/>
        </v-btn>
        <v-btn small>
          <fa-icon icon="table" size="lg"/>
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <!-- Task items -->
    <v-col class="pt-2">
      <!-- Tasks table -->
      <task-table v-if="viewMode" :tasks="tasks"/>

      <!-- Tasks cards -->
      <task-cards v-else :tasks="tasks"/>
    </v-col>

    <!-- Create task form button -->
    <task-form/>

    <!-- Task page router view -->
    <router-view/>
  </v-row>
</template>

<script>
import { zones, folders, tasks } from '@/mixins/units'
import signalR from '@/mixins/signalR'

const SearchField = () => import('@/components/SearchField')
const TaskCards = () => import('./TaskCards')
const TaskTable = () => import('./TaskTable')
const TaskForm = () => import('@/views/tasks/task-create/TaskForm')

export default {
  name: 'TaskList',
  mixins: [zones, folders, tasks, signalR],
  components: {
    SearchField,
    TaskCards,
    TaskTable,
    TaskForm
  },

  data () {
    return {
      viewMode: false
    }
  },

  watch: {
    $route (to, from) {
      const activeFolder = from.params.folderId
      const targetFolder = to.params.folderId
      if (to.name === 'task-list' && activeFolder !== targetFolder) {
        this.getTasks(targetFolder)
      }
    }
  },

  created () {
    this.getTasks(this.activeFolderId)
    this.startSignalRConnection()
  }
}
</script>
