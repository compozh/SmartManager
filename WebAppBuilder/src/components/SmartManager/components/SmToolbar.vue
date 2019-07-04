<template>
  <v-container fluid pa-0>
    <v-layout row align-center justify-space-beetwen>
      <v-flex shrink>
        <router-link
          tag="h1"
          class="blue--text text--darken-2 font-weight-thin"
          :to="{ name:'SMARTMANAGERTASKS', params:{ foldercode: 'ALL' }}"
        ><a>Smart Manager</a>
        </router-link>
      </v-flex>
      <v-spacer></v-spacer>
      <v-text-field
        v-if="showSearch"
        flat
        solo
        clearable
        label="Search"
        prepend-inner-icon="search"
        v-model.trim="search"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-flex shrink>
        <user-panel mini="true"></user-panel>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
  export default {
    name: "sm-toolbar",
    computed: {
      showSearch() {
        return this.$route.params.hasOwnProperty('foldercode')
      },
      search: {
        get() {
          return this.$store.state.sm.search
        },
        set(search) {
          this.$store.commit('sm/setSearch', search)
        }
      }
    }
  }
</script>

<style scoped>
  h1 {
    font-size: 30px;
    text-align: left;
    white-space: nowrap;
  }

  a {
    text-decoration: none;
  }

  .v-input >>> .v-input__control {
    min-height: 40px;
  }

  .v-input >>> .v-input__slot {
    box-shadow: inset 1px 1px 0 0 rgba(100, 121, 143, 0.122),
    inset -1px -1px 0 0 rgba(100, 121, 143, 0.122);
    margin: 0;
    min-height: 40px;
  }

</style>