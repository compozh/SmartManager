<template>
  <v-container ma-0 pa-0 pt-3>
    <v-toolbar color="cyan" dark :dense="$vuetify.breakpoint.smAndDown">
      <v-toolbar-title>Заявки ТО</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-if="$vuetify.breakpoint.mdAndUp"
        v-model="search"
        append-icon="search"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
    </v-toolbar>
    <v-tabs color="cyan" dark slider-color="yellow" icons-and-text lang>
      <v-tab key="active">
        Активные
        <v-icon>build</v-icon>
      </v-tab>
      <v-tab key="archive">
        Архивные
        <v-icon>list</v-icon>
      </v-tab>
      <v-tabs-items touchless>
        <v-tab-item key="active" lazy>
          <eam-base-table
            :query="query"
            :queryName="queryName"
            searchPath="content"
            :headers="headers"
            :search="search"
            :constantFilter="activeFilter"
            :constantOrderBy="[{ path: 'id', descending: true }]"
            updateEventName="workRequestAdded"
          >
            <template slot="row" slot-scope="props">
              <td>
                <v-icon
                  :color="props.item.workRequestCategoryId == '4' ? 'red' : 'green'"
                >{{ sourceIcon(props.item.source) }}</v-icon>
              </td>
              <td class="text-xs-right">{{ props.item.id }}</td>
              <td>{{ statusCaption(props.item.status) }}</td>
              <td class="text-xs-right">{{ timeElapsed(props.item.creationDate) }}</td>
              <td>{{ props.item.content }}</td>
              <td>
                <eam-wr-direction-simple-card :item="props.item.direction" />
              </td>
              <td>
                <eam-wr-category-simple-card :item="props.item.category" />
              </td>
              <td>
                <eam-employee-simple-card :item="props.item.declarerEmployee" />
              </td>
            </template>
          </eam-base-table>
        </v-tab-item>
        <v-tab-item key="archive" lazy>
          <eam-base-table
            :query="query"
            :queryName="queryName"
            searchPath="content"
            :headers="headers"
            :search="search"
            :constantFilter="archiveFilter"
            :constantOrderBy="[{ path: 'id', descending: true }]"
          >
            <template slot="row" slot-scope="props">
              <td>
                <v-icon
                  :color="props.item.workRequestCategoryId == '4' ? 'red' : 'green'"
                >{{ sourceIcon(props.item.source) }}</v-icon>
              </td>
              <td>{{ props.item.id }}</td>
              <td>{{ statusCaption(props.item.status) }}</td>
              <td>{{ timeElapsed(props.item.creationDate) }}</td>
              <td>{{ props.item.content }}</td>
              <td>
                <eam-wr-direction-simple-card :item="props.item.direction" />
              </td>
              <td>
                <eam-wr-category-simple-card :item="props.item.category" />
              </td>
              <td>
                <eam-employee-simple-card :item="props.item.declarerEmployee" />
              </td>
            </template>
          </eam-base-table>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
import allWorkRequests from '@/api/workRequests/allWorkRequests.gql'

import * as moment from 'moment'
import {sourceIcon, statusCaption} from '@/helpers/work-requests'

const archiveStatusCodes = ['A', 'C']

export default {
  name: 'eam-work-requests-table',
  props: {
    constantFilter: Array,
    constantOrderBy: Array
  },
  data() {
    return {
      query: allWorkRequests,
      queryName: 'workRequestConnection',
      baseActiveFilter: [
        { path: 'statusCode', comparison: 'notIn', value: archiveStatusCodes }
      ],
      baseArchiveFilter: [
        { path: 'statusCode', comparison: 'in', value: archiveStatusCodes }
      ],
      headers: [
        { text: '', value: 'source' },
        { text: '№', value: 'id', align: 'rigth' },
        { text: 'Статус', value: 'status', align: 'left' },
        { text: 'От подачи', value: 'creationDate', align: 'rigth' },
        { text: 'Содержание', value: 'content', align: 'left' },
        { text: 'Направление', value: 'direction.name', align: 'left' },
        { text: 'Категория', value: 'category.name', align: 'left' },
        { text: 'Заявитель', value: 'declarerEmployee.fullName', align: 'left' }
      ],
      search: ''
    }
  },

  computed: {
    activeFilter() {
      return this.constantFilter
        ? this.baseActiveFilter.concat(this.constantFilter)
        : this.baseActiveFilter
    },
    archiveFilter() {
      return this.constantFilter
        ? this.baseArchiveFilter.concat(this.constantFilter)
        : this.baseArchiveFilter
    }
  },

  methods: {
    timeElapsed(date) {
      const totalMinuteElapsed = Math.floor(
        moment.duration(moment().diff(moment(date))).asMinutes()
      )
      const daysElapsed = `${Math.floor(totalMinuteElapsed / 1440)} д `
      const hoursElapsed = `${Math.floor(totalMinuteElapsed / 60 ) % 24} ч `
      const minuteElapsed = `${totalMinuteElapsed % 60} м`

      return ` ${daysElapsed ? daysElapsed : ''}${hoursElapsed ? hoursElapsed : ''}${minuteElapsed ? minuteElapsed : ''}`
    },
    sourceIcon(source) {
      return sourceIcon(source)
    },
    statusCaption(status) {
      return statusCaption(status)
    }
  }
}
</script>

<style>
</style>
