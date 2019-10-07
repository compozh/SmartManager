<template>
  <v-container pa-0 pb-3 class="main-info">
    <v-layout wrap justify-space-between>
      <v-flex d-flex xs12 md6 pt-2 :class="{'pr-2': $vuetify.breakpoint.mdAndUp}">
        <v-card min-width="200">
          <eam-equipment-images :equipmentId="item ? item.id : ''" />
          <v-spacer></v-spacer>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{item.fullName}}</h3>
              <div>{{item.description}}</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 md6 pt-2>
        <v-list subheader dense>
          <v-subheader v-if="item.status" d-flex class="primary headline text-uppercase">Статус</v-subheader>

          <v-chip
            v-if="item.status"
            color="green"
            disabled
            style="width:99%; margin:0.5%"
            class="white--text subheading"
          >{{item.status.name}}</v-chip>

          <v-subheader class="primary headline text-uppercase">Основные данные</v-subheader>

          <eam-equipment-main-info-list-item
            v-if="item.itObject"
            icon="home"
            title="Объект"
            :value="item.itObject.name"
          ></eam-equipment-main-info-list-item>
          <eam-equipment-main-info-list-item
            v-if="item.department"
            icon="domain"
            title="Подразделение"
            :value="item.department.name"
          ></eam-equipment-main-info-list-item>

          <eam-equipment-main-info-list-item
            v-if="item.type"
            icon="title"
            title="Тип"
            :value="item.type.name"
          ></eam-equipment-main-info-list-item>

          <eam-equipment-main-info-list-item
            v-if="item.model"
            icon="settings"
            title="Модель"
            :value="item.model.name"
          ></eam-equipment-main-info-list-item>

          <eam-equipment-main-info-list-item
            v-if="item.installDate"
            icon="query_builder"
            title="Дата ввода в експл."
            :value="installDateString"
          ></eam-equipment-main-info-list-item>

          <eam-equipment-main-info-list-item
            v-if="item.factoryNumber"
            icon="notes"
            title="Заводской номер"
            :value="item.factoryNumber"
          ></eam-equipment-main-info-list-item>

          <eam-equipment-main-info-list-item
            v-if="item.category"
            icon="view_carousel"
            title="Категория"
            :value="item.category.name"
          ></eam-equipment-main-info-list-item>

          <v-subheader class="primary headline text-uppercase">Состояние</v-subheader>

          <eam-equipment-main-info-list-item
            v-if="lastRepairDateString"
            icon="alarm_on"
            title="Дата последнего ТО"
            :value="lastRepairDateString"
          ></eam-equipment-main-info-list-item>

          <eam-equipment-main-info-list-item
            v-if="lastWorkRequestDateString"
            icon="query_builder"
            title="Дата последней заявки"
            :value="lastWorkRequestDateString"
          ></eam-equipment-main-info-list-item>

          <v-subheader class="primary headline text-uppercase">Ответственные</v-subheader>

          <template v-for="(responsible,i) in responsibleList">
            <eam-equipment-main-info-list-item
              :key="i"
              v-if="responsible.employee"
              icon="person"
              :color="responsible.isResponsible ? 'blue' : ''"
              :title="responsible.employee.fullName"
              :value="responsible.direction ? responsible.direction.name : ''"
            ></eam-equipment-main-info-list-item>
          </template>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as moment from 'moment'

export default {
  name: 'eam-equipment-main-info-card',  
  props: {
    item: Object
  },  
  computed: {
    loading() {
      return this.$store.getters['eam/loading']
    },
    installDateString() {
      return moment(this.item.installDate).format('DD.MM.YYYY')
    },
    lastWorkRequestDateString() {
      return this.item.lastWorkRequest && this.item.lastWorkRequest.length
        ? moment(this.item.lastWorkRequest[0].creationDate).format('DD.MM.YYYY')
        : ''
    },
    lastRepairDateString() {
      return this.item.lastRepair && this.item.lastRepair.length
        ? moment(this.item.lastRepair[0].factDate).format('DD.MM.YYYY')
        : ''
    },
    responsibleList() {
      if (!this.item) {
        return []
      }
      let items = []
      if (this.item.responsibleEmployee) {
        items.push({
          employee: this.item.responsibleEmployee,
          isResponsible: true
        })
      }
      if (
        this.item.currentMovementRecord &&
        this.item.currentMovementRecord.technicalPlace
      ) {
        if (
          this.item.currentMovementRecord.technicalPlace.responsibleEmployee
        ) {
          items.push({
            employee: this.item.currentMovementRecord.technicalPlace
              .responsibleEmployee,
            isResponsible: true
          })
        }
        if (
          this.item.currentMovementRecord.technicalPlace.allParents &&
          this.item.currentMovementRecord.technicalPlace.allParents.length
        ) {
          const parentTechPlaces = this.item.currentMovementRecord.technicalPlace.allParents.map(
            p => p.technicalPlace
          )
          items = items.concat(
            parentTechPlaces.reduce(function(a, b) {
              return a.concat(b.responsibleSpecialists)
            }, [])
          )
        }
      }
      return items
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
.v-subheader {
  background-color: lightgreen !important;
}
</style>
