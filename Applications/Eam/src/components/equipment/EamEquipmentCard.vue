<template>
  <v-flex xs12 md6 pa-1>
    <v-hover>
      <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 7 : 2} subheading`" height="100%">
        <v-card-title class="py-2">
          <eam-equipment-type-simple-card :item="equipment.type" />
          <v-spacer></v-spacer>
          <router-link :to="{ name: 'EAMEQUIPMENTINFO', params: { id: equipment.id }}">
            <a>{{equipment.id}}</a>
          </router-link>
        </v-card-title>
        <v-card-text>
          <v-layout column fill-height mb-2>
            <span class="subheading font-weight-bold">{{equipment.fullName}}</span>
            <v-layout wrap justify-space-between>
              <span>{{equipment.name}}</span>
              <span>{{equipment.designation}}</span>
            </v-layout>
          </v-layout>
          <v-divider></v-divider>
          <eam-model-simple-card :item="equipment.model" />
          <v-layout wrap justify-space-between>
            <eam-itobject-simple-card :item="equipment.itObject" />
            <eam-department-simple-card :item="equipment.department" />
            <eam-techplace-simple-card
              v-if="equipment.currentMovementRecord"
              :item="equipment.currentMovementRecord.technicalPlace"
            />
          </v-layout>          
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="equipment.responsibleEmployee || equipment.factoryNumber">
          <eam-employee-simple-card :item="equipment.responsibleEmployee" />
          <v-spacer></v-spacer>
          <v-layout v-if="equipment.factoryNumber" shrink>
            <v-icon class="mr-1" color="cyan">class</v-icon>
            <span wrap>{{ equipment.factoryNumber }}</span>
          </v-layout>
        </v-card-actions>
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
