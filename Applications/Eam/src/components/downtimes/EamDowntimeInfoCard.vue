<template>
  <v-container pa-0 pb-3 class="main-info">
    <v-layout wrap justify-space-between>
      <v-flex v-if="item && item.equipment" d-flex xs12 md6 pt-2 :class="{'pr-2': $vuetify.breakpoint.mdAndUp}">
        <v-card min-width="200">
          <eam-equipment-images :equipmentId="item.equipment.id" />
          <v-spacer></v-spacer>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{item.equipment.fullName ? item.equipment.fullName : item.equipment.name}}</h3>              
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 md6 pt-2>
        <v-list subheader dense>
          <v-subheader
            v-if="item.additionalData && (item.additionalData.isEmergency || item.additionalData.isPlanned)"
            d-flex
            class="primary headline text-uppercase"
          >Статус</v-subheader>

          <v-chip
            v-if="item.additionalData && item.additionalData.isEmergency"
            color="red"
            text-color="white"
          >
            <v-avatar left>
              <v-icon>error_outline</v-icon>
            </v-avatar>Аварийный
          </v-chip>
          <v-chip
            v-if="item.additionalData && item.additionalData.isPlanned"
            color="green"
            text-color="white"
          >
            <v-avatar left>
              <v-icon>insert_invitation</v-icon>
            </v-avatar>Плановый
          </v-chip>

          <v-subheader class="primary headline text-uppercase">Основные данные</v-subheader>

          <eam-equipment-main-info-list-item
            v-if="item.department"
            icon="domain"
            title="Подразделение"
            :value="item.department.name"
          ></eam-equipment-main-info-list-item>

          <eam-equipment-main-info-list-item
            v-if="item.technicalPlace"
            icon="line_style"
            title="Тех.место"
            :value="item.technicalPlace.name"
          ></eam-equipment-main-info-list-item>

          <eam-equipment-main-info-list-item
            v-if="item.equipment"
            icon="reorder"
            title="Оборудование"
            :value="item.equipment.name ? item.equipment.name : item.equipment.fullName"
          ></eam-equipment-main-info-list-item>

          <eam-equipment-main-info-list-item
            v-if="item.model"
            icon="settings"
            title="Модель"
            :value="item.model.name"
          ></eam-equipment-main-info-list-item>

          <v-subheader class="primary headline text-uppercase">Простой</v-subheader>

          <eam-equipment-main-info-list-item
            v-if="item.date"
            icon="access_time"
            title="Время начала"
            :value="startDateText"
          ></eam-equipment-main-info-list-item>
          <eam-equipment-main-info-list-item
            v-if="item.endDate"
            icon="access_time"
            title="Время завершения"
            :value="endDateText"
          ></eam-equipment-main-info-list-item>

          <eam-equipment-main-info-list-item
            v-if="item.value"
            icon="access_time"
            title="Длительность, час"
            :value="item.value.toString()"
          ></eam-equipment-main-info-list-item>

          <v-subheader class="primary headline text-uppercase">Ответственный</v-subheader>

          <eam-equipment-main-info-list-item
            v-if="item.additionalData && item.additionalData.responsible"
            icon="person"
            :title="item.additionalData.responsible.fullName"
          ></eam-equipment-main-info-list-item>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { typeName } from '@/helpers/downtimes'
import * as moment from 'moment'

export default {
  name: 'eam-downtime-info-card',
  props: {
    item: Object
  },
  data() {
    return {}
  },
  computed: {
    loading() {
      return this.$store.getters['eam/loading']
    },
    typeName() {
      if (!this.item.additionalData) {
        return ''
      }
      return typeName(this.item.additionalData.downTimeType)
    },
    startDateText() {
      return moment(this.item.date).format('DD.MM.YYYY HH:mm')
    },
    endDateText() {
      return this.item.endDate
        ? moment(this.item.endDate).format('DD.MM.YYYY HH:mm')
        : '...'
    }
  }
}
</script>

<style scoped>
.main-info >>> .v-list--dense .v-list__tile--avatar {
  height: auto;
}
.main-info >>> .v-list__tile__avatar {
  min-width: 10px;
  padding-right: 5px;
}
.main-info >>> .v-avatar {
  width: auto !important;
  padding-right: 5px;
}
.v-subheader {
  background-color: rgb(144, 219, 238) !important;
}
</style>
