<template>
  <v-list-tile avatar>
    <v-list-tile-avatar>
      <v-icon :color="color">{{ icon }}</v-icon>
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title style="white-space:normal">{{ title }}</v-list-tile-title>
      <v-list-tile-sub-title
        style="white-space:normal"
      >{{ $vuetify.breakpoint.mdAndUp ? info : value }}</v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-action
      v-if="$vuetify.breakpoint.mdAndUp"
      style="white-space:normal"
    >{{ value }}</v-list-tile-action>
  </v-list-tile>
</template>

<script>
export default {
  name: 'eam-equipment-main-info-list-item',
  props: {
    icon: String,
    color: String,
    title: String,
    info: String,
    value: String
  },
}
</script>

<style scoped>
.v-list--dense .v-list__tile--avatar {
  height: auto;
}
.v-list--dense .v-list__tile--avatar {
  height: auto;
}
.v-list__tile__avatar {
  min-width: 10px;
  padding-right: 5px;
}
.v-avatar {
  width: auto !important;
  padding-right: 5px;
}
</style>
