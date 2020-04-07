<template>
  <v-data-iterator :items="tasks"
                   items-per-page.sync="itemsPerPage"
                   :page="page"
                   :search="search"
                   :hide-default-footer="hideFooter"
                   class="mb-12">

    <template v-slot:default="props">
      <v-row>
        <v-col v-for="task in props.items"
          :key="task.id" cols="12" class="py-1">
          <router-link :to="{name: 'task-details', params: {taskId: task.id}}"
                       tag="v-card" :style="cardStyle(task)">
            <v-row>
                <v-col cols="8" class="py-1">
                  <h5 class=" ma-0 pl-2">{{ task.name }}</h5>
                  <h6 class=" ma-0 pl-2 indigo--text">{{ task.descript || task.docCaption  }}</h6>
                </v-col>
                <v-col class="py-1 px-5 text-right">
                  <p class="caption mb-0">{{ $t('tasks.deadline') }}: {{ task.dateplan }}</p>
                  <p class="caption mb-0">{{ $t('tasks.done') }}: {{ task.dateFact }}</p>
                </v-col>
              </v-row>
            <v-row>
                <v-col class="py-1">
                  <v-avatar color="grey lighten-1" class="mx-3" size="30px">
                    <fa-icon v-if="!task.addedPhoto" :icon="['fal', 'user']" inverse/>
                    <v-img v-else :src="task.addedPhoto"/>
                  </v-avatar>
                  <span class="body-2">{{ task.addedFio }}</span>
                </v-col>
                <v-col class="py-1 px-5 d-flex align-center justify-end">
                  <fa-icon v-if="task.caseId" class="ml-2 blue-grey--text" :icon="['fal', 'suitcase']"/>
                  <fa-icon v-if="task.hasCom" class="ml-2" :icon="['fal', 'comment-alt-lines']"/>
                  <fa-icon v-if="task.hasOrig" class="ml-2 brown--text" :icon="['fal', 'paperclip']"/>
                  <fa-icon v-if="task.isFavorite" class="ml-2 blue--text text--lighten-2" :icon="['fal', 'star']"/>
                  <fa-icon v-if="task.isGenerated" class="ml-2 " :icon="['fal', 'layer-plus']"/>
                  <fa-icon v-if="task.isMy" class="ml-2 orange--text" :icon="['fal', 'portrait']"/>
                  <fa-icon v-if="task.myControl" class="ml-2 indigo--text" :icon="['fal', 'eye']"/>
                  <fa-icon v-if="task.priority" class="ml-2 red--text" :icon="['fal', 'exclamation-triangle']"/>
                </v-col>
              </v-row>
          </router-link>
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
export default {
  name: 'DataIterator',
  props: ['tasks', 'hideFooter'],
  data: () => ({
    search: '',
    filter: {},
    sortDesc: false,
    page: 1,
    itemsPerPage: 1,
    sortBy: 'name'
  }),
  computed: {
    cardStyle () {
      return task => ({
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderLeftColor: task.status === '' ? '#43A047' : '#FF5722',
        borderRightColor: task.isRead ? 'grey' : '#009688'
      })
    },
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
