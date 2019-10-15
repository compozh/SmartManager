<template>
  <v-flex xs12 md6 pa-1>
    <v-hover>
      <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 7 : 2} subheading`" height="100%">
        <router-link :to="{ name: '_EFFICIENCYLOSSINFO', params: { id: item.id }}">
          <v-card-title class="py-2">
            <v-chip class="ma-0 mr-2" color="orange" text-color="white">
              <v-avatar left>
                <v-icon>toc</v-icon>
              </v-avatar>
              {{indicatorName}}
            </v-chip>
            <v-spacer></v-spacer>
            <v-chip
              v-if="item.isApproved && item.isValid"
              class="ma-0 mr-2"
              color="green"
              text-color="white"
            >
              <v-avatar left>
                <v-icon>check</v-icon>
              </v-avatar>Утвержден
            </v-chip>
            <v-chip v-if="!item.isValid" class="ma-0 mr-2" color="grey" text-color="white">
              <v-avatar left>
                <v-icon>cancel</v-icon>
              </v-avatar>Отменен
            </v-chip>
            <!-- <span>{{item.id}}</span> -->
          </v-card-title>
        </router-link>
        <v-card-text>
          <v-layout wrap justify-space-between mb-2>
            <work-center-simple-card :item="item.workCenter" />
            <eam-techplace-simple-card :item="item.technicalPlace" />
          </v-layout>
          <v-layout wrap justify-space-between mb-2>
            <v-layout>
              <v-icon color="green" class="mr-2">access_time</v-icon>
              <span class="mr-2">{{startDateText}}</span>
              <span class="mr-2">-</span>
              <span class="mr-2">{{endDateText}}</span>
            </v-layout>
            <v-flex shrink>
              <v-chip v-if="item.lossLevel" class="ma-0 mr-2" color="blue" text-color="white">
                <v-avatar left color="pink">{{item.lossLevel}}</v-avatar>
                {{typeName}}
              </v-chip>
            </v-flex>
          </v-layout>

          <!-- <v-layout align-center wrap justify-space-between>
            <v-spacer></v-spacer>
            <eam-employee-simple-card :item="item.responsible" class="justify-end" />
          </v-layout>-->
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions :class="efficiencyActionsClass">
          <v-layout wrap justify-space-between>
            <eam-failure-reason-simple-card :item="item.category" />
            <eam-failure-type-simple-card :item="item.reason" />
            <eam-wr-direction-simple-card :item="item.source" />
          </v-layout>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="editDialog"
            max-width="700"
            lazy
            :fullscreen="$vuetify.breakpoint.smAndDown"
          >
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" class="ma-0 ml-1">
                <v-icon color="purple">edit</v-icon>
              </v-btn>
            </template>
            <efficiency-loss-form :item="item" @complete="save" />
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-flex>
</template>

<script>
import { typeName, indicatorName } from '@/helpers/efficiency'
import * as moment from 'moment'

export default {
  name: 'efficiency-loss-card',
  props: {
    item: Object
  },
  data: () => {
    return {
      editDialog: false
    }
  },
  computed: {
    typeName() {
      return typeName(this.item.lossType)
    },
    indicatorName() {
      return indicatorName(this.item.indicator)
    },
    startDateText() {
      return moment(this.item.startTime).format('DD.MM.YYYY HH:mm')
    },
    endDateText() {
      return this.item.endTime
        ? moment(this.item.endTime).format('DD.MM.YYYY HH:mm')
        : '...'
    },
    efficiencyActionsClass() {
      return this.item.category && this.item.category && this.item.category
        ? 'efficiency-actions-green'
        : 'efficiency-actions-pink'
    }
  },
  methods: {
    save() {
      this.editDialog = false
    }
  }
}
</script>

<style scoped>
.v-card__title {
  background-color: rgb(144, 219, 238);
}
a {
  text-decoration: none !important;
}
.efficiency-actions-pink {
  background-color: #fce4ec;
}
.efficiency-actions-green {
  background-color: #e8f5e9;
}
</style>
