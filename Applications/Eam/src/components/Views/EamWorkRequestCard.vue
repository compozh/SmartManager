<template>
  <v-flex xs12 md6 pa-1>
    <v-hover>
      <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 7 : 2} subheading`" height="100%">
        <v-card-title>
          <v-icon v-if="item.workRequestCategoryId === '4'" color="red">warning</v-icon>
          <v-icon color="blue">{{sourceIcon}}</v-icon>
          <span>{{statusCaption}}</span>
          <v-spacer></v-spacer>
          <span>{{item.id}}</span>
        </v-card-title>
        <v-card-text>
          <v-layout row style="height: 100%">
            <v-flex xs12 md6>
              <v-layout column>
                <span class="subheading font-weight-bold">{{item.content}}</span>
                <span class="subheading font-weight-bold">{{item.creationDate}}</span>
              </v-layout>
            </v-flex>
            <v-flex xs12 md6>
              <v-layout column>
                <eam-department-simple-card :item="item.department" />
                <eam-techplace-simple-card :item="item.technicalPlace" />
                <eam-equipment-simple-card :item="item.equipment" />
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <v-layout>
              З:
              <eam-employee-simple-card :item="item.declarerEmployee" />
            </v-layout>
            <v-layout>
              О:
              <eam-employee-simple-card :item="item.responsibleEmployee" />
            </v-layout>
            <v-layout>
              И:
              <eam-employee-simple-card :item="item.performerEmployee" />
            </v-layout>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-hover>
  </v-flex>
</template>

<script>
export default {
  name: 'eam-work-request-card',
  props: {
    item: Object
  },
  computed: {
    sourceIcon() {
      switch (this.item.source) {
      case 'REMARKS_OF_STAFF':
        return 'perm_identity'
      case 'PLANNED_WORKS':
        return 'insert_invitation'
      case 'OPERATING_STATISTICS':
        return 'multiline_chart'
      case 'DOWN_TIME':
        return 'query_builder'
      default:
        return 'border_all'
      }
    },
    statusCaption() {
      switch (this.item.status) {
      case 'CREATION':
        return 'Заявитель'
      case 'DISPATCHER':
        return 'Диспетчер'
      case 'RESPONSIBLE':
        return 'Определение ответственного'
      case 'PREPARATION':
        return 'Подготовка'
      case 'EXECUTION':
        return 'Выполнение'
      case 'DONE':
        return 'Выполнено'
      case 'CANCELED':
        return 'Отменена'
      case 'ARCHIVE':
        return 'Архив'
      default:
        return 'Не определена'
      }
    }
  }
}
</script>

<style scoped>
.v-card__title {
  background-color: rgb(232, 253, 158);
}
.v-card__text {
  text-align: initial;
}
</style>
