<template>
<v-flex>
  <v-text-field v-if="this.$vuetify.breakpoint.mdAndUp" v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
  <v-menu v-if="!this.$vuetify.breakpoint.mdAndUp" :close-on-content-click="false">
        <template v-slot:activator="{on}">
          <v-btn color="primary" v-on="on" icon large>
            <v-icon>search</v-icon>
          </v-btn>
        </template>
        <v-flex pa-2><v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field></v-flex>
      </v-menu>
      </v-flex>
</template>

<script>
export default {
  name: "eam-search",
  computed: {
    search: {
      get: function() {
        return this.$store.getters["eam/search"];
      },
      set: function(newValue) {
        this.$store.commit("eam/setSearch", newValue);
      }
    }
  }
};
</script>

<style scoped>
.v-menu__content {
    background-color: white;
    top: 65px !important;
    left: 1% !important;
    width: 98%;
    max-width: 98%;
  }

  .v-menu__content.v-menu__content--auto {
    top: 208px !important;
  }
</style>