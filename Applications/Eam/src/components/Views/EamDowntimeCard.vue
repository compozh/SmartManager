<template>
  <v-flex xs12 md6 pa-1>
    <v-hover>
      <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 7 : 2} subheading`" height="100%">
        <v-card-title>
          <v-icon v-if="item.additionalData && item.additionalData.isEmergency" color="red">warning</v-icon>
          <v-icon
            v-if="item.additionalData && item.additionalData.isPlanned"
            color="blue"
          >local_parking</v-icon>
          <span>{{typeNeme}}</span>
          <v-spacer></v-spacer>
          <span>{{item.id}}</span>
        </v-card-title>
        <v-card-text>
          <v-layout row style="height: 100%">
            <v-flex xs12 md6>
              <v-layout column>
                <v-flex>
                  Начало:
                  <span class="subheading font-weight-bold">{{item.date}}</span>
                </v-flex>
                <v-flex>
                  Конец:
                  <span class="font-weight-bold">{{item.endDate}}</span>
                </v-flex>
                <v-flex>
                  Длительность:
                  <span class="font-weight-bold">{{item.value}} ч</span>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 md6>
              <v-layout column>
                <eam-employee-simple-card
                  v-if="item.additionalData"
                  :item="item.additionalData.responsible"
                />
                <eam-department-simple-card :item="item.department" />
                <eam-techplace-simple-card :item="item.technicalPlace" />
                <eam-equipment-simple-card :item="item.equipment" />
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text v-if="item.additionalData">
          <v-layout row wrap>
            <eam-direction-simple-card :item="item.additionalData.direction" />
            <eam-failure-type-simple-card :item="item.additionalData.failureType" />
            <eam-failure-reason-simple-card :item="item.additionalData.failureReason" />
            <v-dialog v-model="editDialog" width="700" lazy>
              <template v-slot:activator="{ on }">
                <v-btn icon color="red lighten-2" dark v-on="on">
                  <v-icon>edit</v-icon>
                </v-btn>
              </template>
              <eam-downtime-form :item="item" @complete="save" />
            </v-dialog>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-hover>
  </v-flex>
</template>

<script>
export default {
  name: 'eam-downtime-card',
  props: {
    item: Object
  },
  data: () => {
    return {
      editDialog: false
    }
  },
  computed: {
    typeNeme() {
      if (!this.item.additionalData) {
        return ''
      }
      switch (this.item.additionalData.downTimeType) {
        case 'T':
          return 'Технологический'
        case 'M':
          return 'Ремонтный'
        case 'E':
          return 'Внешний'
        default:
          return ''
      }
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
</style>
