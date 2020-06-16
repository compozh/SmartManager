<template>
  <v-row no-gutters style="flex-basis: 0;"
         class="flex-grow-1">
    <v-col class="pa-0">
      <v-row dense align-content="start" justify="start">
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

      <v-row v-if="viewMode">
        <v-col>
          <task-table :tasks="tasks"/>
        </v-col>
      </v-row>
      <task-cards v-else :tasks="tasks"/>
      <task-form/>
    </v-col>
    <router-view/>
  </v-row>
</template>

<script>
import SearchField from '@/components/SearchField'
import TaskCards from './TaskCards'
import TaskTable from './TaskTable'
import TaskForm from '@/views/tasks/task-create/TaskForm'
import { zones, folders, tasks } from '@/mixins/units'
import signalR from '@/mixins/signalR'

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
