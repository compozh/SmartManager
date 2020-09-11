<template>
  <v-row no-gutters style="flex-basis: 0;"
         class="flex-grow-1 overflow-hidden">
    <v-col class="d-flex flex-column fill-height pa-0">
      <v-row dense justify="start"
             align-content="start"
             class="flex-grow-0">
        <v-col class="d-flex">
          <search-field class="mt-n3 ml-1"/>
          <v-spacer/>
          <v-btn-toggle v-model="viewMode" mandatory class="mt-n1">
            <v-btn small>
              <fa-icon icon="list-alt" size="lg"/>
            </v-btn>
            <v-btn small>
              <fa-icon icon="table" size="lg"/>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <task-table v-if="viewMode" :tasks="tasks"/>
      <task-cards v-else :tasks="tasks"/>
      <task-form/>
    </v-col>
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

<style>

  .grid-headers {
    min-width: 110px;
  }

</style>
