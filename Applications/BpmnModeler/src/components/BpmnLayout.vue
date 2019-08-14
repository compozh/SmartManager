<template>
  <v-app>
    <vue-title title="Bpmn"></vue-title>
    <v-toolbar
               app
               clipped-left
               class="toolbar">
      <v-toolbar-side-icon 
        class="blue--text text--darken-2"
        @click.stop="appBar = !appBar">
      </v-toolbar-side-icon>
      <v-toolbar-title>{{ toolbarTitle }}</v-toolbar-title>
      <router-view name="toolbar" />
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-navigation-drawer v-model="appBar"
                         app
                         clipped
                         width="270">
      <router-view name="models" />
    </v-navigation-drawer>

    <v-content class="white">
      <v-container fluid pa-0 fill-height>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'bpmn-layout',
  props: ['toolbarTitle'],
  data () {
    return {
      appBar: null
    }
  },
  methods: {
  },
  computed: {
    currentUser() {
      if (this.$store.state.authentication.currentUser) {
        return this.$store.state.authentication.currentUser.UserData.CurrentUserData.UserName
      }
    }
  },
  watch: {
  }
}
</script>

<style scoped>

  .toolbar {
    background: #fff;
    box-shadow: inset 0 -1px 0 rgba(100, 121, 143, 0.122);
  }

  .circular-loader {
    background-color: rgba(255, 255, 255, .5);
    z-index: 10;
  }

  .linear-loader {
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0;
  }
</style>
