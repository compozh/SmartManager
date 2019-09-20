<template>
  <v-flex xs12 md6 pa-1>
    <v-hover>
      <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 7 : 2} subheading`" height="100%">
        <v-card-title>
          <eam-equipment-type-simple-card :item="equipment.type"/>
          <v-spacer></v-spacer>
          <router-link :to="{ name: 'EAMEQUIPMENTINFO', params: { id: equipment.id }}">
            <a>{{equipment.id}}</a>
          </router-link>
        </v-card-title>
        <v-card-text>
          <v-layout row style="height: 100%">
            <v-flex xs12 md6>
              <v-layout column>
                <v-flex>
                  Полное наим.:
                  <span class="subheading font-weight-bold">{{equipment.fullName}}</span>
                </v-flex>
                <v-flex>
                  Наименование:
                  <span class="font-weight-bold">{{equipment.name}}</span>
                </v-flex>
                <v-flex>
                  Обозначение:
                  <span class="font-weight-bold">{{equipment.designation}}</span>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 md6>
              <v-layout column>
                <eam-model-simple-card :item="equipment.model"/>
                <eam-employee-simple-card :item="equipment.responsibleEmployee"/>
                <eam-techplace-simple-card
                  v-if="equipment.currentMovementRecord"
                  :item="equipment.currentMovementRecord.technicalPlace"
                />
                <eam-department-simple-card :item="equipment.department"/>
                <eam-itobject-simple-card :item="equipment.itObject"/>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout v-if="equipment.factoryNumber">
            <v-icon class="mr-1" color="cyan">class</v-icon>
            <span wrap>{{ equipment.factoryNumber }}</span>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-hover>
  </v-flex>
</template>

<script>
export default {
  name: 'eam-equipment-card',
  props: {
    equipment: Object
  }
}
</script>

<style scoped>
.v-card__title {
  background-color: lightgreen;
}
</style>
