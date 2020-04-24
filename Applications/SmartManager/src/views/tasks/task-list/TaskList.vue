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
          <v-data-table
            :headers="headers"
            :items="tasks"
            :items-per-page="10"
            class="elevation-1 caption"
            style="font-size: 10px"
            min-width= '90px'
          >
            <!--status-->
            <template v-slot:item.status="{ item }">
              <!-- {{item.status}} -->
              <fa-icon v-show="item.status" class="green--text" icon="check"/>
            </template>
            <!--addedFio-->
            <template v-slot:item.addedFio="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-avatar v-on="on" color="grey lighten-1" size="40px">
                    <fa-icon v-if="!item.addedPhoto" icon="user" inverse/>
                    <v-img v-else :src="item.addedPhoto"/>
                  </v-avatar>
                </template>
                <span>{{item.addedFio}}</span>
              </v-tooltip>
            </template>
            <!--name-->
            <template v-slot:item.name="{ item }">
              <span :class="item.isRead ? '' : 'font-weight-bold'">{{item.name}}</span>
            </template>
            <!--role-->
            <template v-slot:item.role="{ item }">
              <span :class="item.isRead ? '' : 'font-weight-bold'">{{item.role ? $t('tasks.' + item.role.toLowerCase()) : '---'}}</span>
            </template>
            <!--docCaption-->
            <template v-slot:item.docCaption="{ item }">
              <span :class="item.isRead ? '' : 'font-weight-bold'">{{item.docCaption}}</span>
            </template>
            <!--dateplan-->
            <template v-slot:item.dateplan="{ item }">
              <span :class="item.isRead ? '' : 'font-weight-bold'">{{item.dateplan}}</span>
            </template>
            <!--dateFact-->
            <template v-slot:item.dateFact="{ item }">
              <span v-if="!taskInProgress(item)" :class="item.isRead ? '' : 'font-weight-bold'">{{item.dateFact}}</span>
              <span v-else>---</span>
            </template>
            <!--hasOrig-->
            <template v-slot:item.hasOrig="{ item }">
              <fa-icon v-show="item.hasOrig" class="ml-2 brown--text" icon="paperclip"/>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <data-iterator v-else :tasks="tasks"/>
    </v-col>
  </v-row>
</template>

<script>
import SearchField from '@/components/SearchField'
import DataIterator from './DataIterator'
import { zones, folders, tasks } from '@/mixins/units'

export default {
  name: 'TaskList',
  mixins: [zones, folders, tasks],
  components: {
    SearchField,
    DataIterator
  },
  data () {
    return {
      viewMode: false,
      headers: [
        { text: this.$t('tasks.status'), align: 'center', value: 'status', class: 'grid-headers' },
        { text: this.$t('tasks.from'), align: 'start', value: 'addedFio', class: 'grid-headers' },
        { text: this.$t('tasks.content'), align: 'start', sortable: false, value: 'name', class: 'grid-headers' },
        { text: this.$t('tasks.role'), align: 'start', value: 'role', class: 'grid-headers' },
        { text: this.$t('tasks.source'), align: 'start', value: 'docCaption', class: 'grid-headers' },
        { text: this.$t('tasks.planDate'), align: 'start', value: 'dateplan', class: 'grid-headers' },
        { text: this.$t('tasks.actualDate'), align: 'start', value: 'dateFact', class: 'grid-headers' },
        { text: this.$t('tasks.hasOrig'), align: 'start', value: 'hasOrig', class: 'grid-headers' }
      ]
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
  },
  methods: {
    taskInProgress (task) {
      return task.status === '' || task.status === '*'
    }
  }
}
</script>
<style>
  .grid-headers {
    min-width: 110px;
  }
</style>
