<template>
  <div>
    <h1 class="ma-5">Task list:
      <span class="primary--text">{{ $route.params.folderId }}</span>
    </h1>

    <v-data-table
      :headers="headers"
      :items="tasks"
      :items-per-page="10"
      class="elevation-1"
    ></v-data-table>
  </div>
</template>

<script>
import { folders, tasks } from '@/mixins/units'

export default {
  name: 'TaskList',
  mixins: [folders, tasks],
  data: () => ({
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
