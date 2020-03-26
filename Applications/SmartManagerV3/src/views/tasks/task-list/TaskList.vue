<template>
  <v-container fluid>

    <v-row dense align-content="start" justify="start">
      <v-col class="d-flex">
        <h4 class="ml-1 mt-1">{{ activeZone.title }}:
          <span class="primary--text">{{ activeFolder.Name }}</span>
          <span class="grey--text"> ({{ activeFolder.Count }})</span>
        </h4>
        <v-spacer/>
        <v-btn-toggle v-model="viewMode" mandatory>
          <v-btn small>
            <fa-icon :icon="['fal', 'list-alt']" size="lg"/>
          </v-btn>
          <v-btn small>
            <fa-icon :icon="['fal', 'table']" size="lg"/>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-row v-if="viewMode">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="tasks"
          :items-per-page="10"
          class="elevation-1 caption"
          style="font-size: 10px"
        ></v-data-table>
      </v-col>
    </v-row>

    <data-iterator v-else :tasks="tasks"/>

    <action-button/>
  </v-container>
</template>

<script>
import ActionButton from '@/components/ActionButton'
import DataIterator from './DataIterator'
import { zones, folders, tasks } from '@/mixins/units'

export default {
  name: 'TaskList',
  mixins: [zones, folders, tasks],
  components: {
    ActionButton,
    DataIterator
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
      const activeFolder = from.params.folderId
      const targetFolder = to.params.folderId
      if (to.name === 'task-list' && activeFolder !== targetFolder) {
        this.getTasks(targetFolder)
      }
    }
  },
  created () {
    this.getTasks(this.activeFolderId)
  }
}
</script>

<style scoped>

</style>
