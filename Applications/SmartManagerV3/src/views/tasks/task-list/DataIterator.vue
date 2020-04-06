<template>
  <v-data-iterator :items="tasks"
                   items-per-page.sync="itemsPerPage"
                   :page="page"
                   :search="search"
                   class="mb-12">

    <template v-slot:default="props">
      <v-row>
        <v-col v-for="task in props.items"
          :key="task.id" cols="12" class="py-1">
          <task-list-item :task="task"/>
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
import TaskListItem from '@/views/tasks/task-list/TaskListItem.vue'

export default {
  name: 'DataIterator',
  props: ['tasks'],
  components: {
    TaskListItem
  },
  data: () => ({
    search: '',
    filter: {},
    sortDesc: false,
    page: 1,
    itemsPerPage: 1,
    sortBy: 'name'
  }),
  computed: {
    numberOfPages () {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key !== 'Name')
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

</style>
