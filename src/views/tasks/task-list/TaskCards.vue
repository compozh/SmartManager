<template>
  <v-data-iterator :items="tasks"
                   items-per-page.sync="itemsPerPage"
                   :page="page"
                   :search="search"
                   :hide-default-footer="hideFooter"
                   :no-data-text="hideNoData ? '' : $t('tasks.noTasks')"
                   :footer-props="{itemsPerPageText: $t('tasks.perPage')}">

    <template #default="props">
      <v-row>
        <v-col v-for="task in props.items"
          :key="task.id" cols="12" class="py-1">
          <task-list-item :task="task"/>
        </v-col>
      </v-row>
    </template>

    <template #no-data v-if="!hideNoData">
      <div class="primary--text body-2 ml-3 mt-3">{{ $t('tasks.noTasks') }}</div>
    </template>

  </v-data-iterator>
</template>

<script>
import TaskListItem from '@/views/tasks/task-list/TaskListItem.vue'

export default {
  name: 'TaskCards',
  components: {
    TaskListItem
  },
  props: {
    tasks: Array,
    hideNoData: Boolean,
    hideFooter: Boolean
  },
  data: () => ({
    search: '',
    page: 1,
    itemsPerPage: 1
  }),
  computed: {
    numberOfPages () {
      return Math.ceil(this.items.length / this.itemsPerPage)
    }
  },
  methods: {
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    }
  }
}
</script>

<style scoped>

  /* Set pagination to left */
  .v-data-iterator >>> .v-data-footer {
    justify-content: flex-start;
    font-size: 14px;
  }

</style>
