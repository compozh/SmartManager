<template>
  <v-container fluid>
    <v-row dense align-content="start" justify="start">
      <v-col class="d-flex">
        <h3 class="ml-1 mt-1">Task list:
          <span class="primary--text">{{ $route.params.folderId }}</span>
        </h3>
        <v-switch v-model="viewMode" label="View mode" class="mt-0 ml-3"/>
      </v-col>
      <v-spacer/>
    </v-row>

    <v-row v-if="viewMode">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="tasks"
          :items-per-page="10"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        List with cards
      </v-col>
    </v-row>

    <action-button/>
  </v-container>
</template>

<script>
import ActionButton from '@/components/ActionButton'
import { folders, tasks } from '@/mixins/units'

export default {
  name: 'TaskList',
  mixins: [folders, tasks],
  components: {
    ActionButton
  },
  data: () => ({
    viewMode: false,
    headers: [
      { text: 'Id', value: 'id' },
      {
        text: 'Name',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      { text: 'Added', value: 'addedFio' },
      { text: 'Description', value: 'descript' },
      { text: 'Caption', value: 'docCaption' },
      { text: 'Date plan', value: 'dateplan' },
      { text: 'Date fact', value: 'dateFact' },
      { text: 'Status', value: 'status' }
    ]
  }),
  watch: {
    $route (to, from) {
      const currentFolder = from.params.folderId
      const targetFolder = to.params.folderId
      if (to.name === 'task-list' && currentFolder !== targetFolder) {
        this.getTasks(targetFolder)
      }
    }
  },
  created () {
    this.getTasks(this.folderId)
  }
}
</script>

<style scoped>

</style>
