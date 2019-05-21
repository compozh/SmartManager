<template>
  <v-app>
    <v-toolbar
      app
      clipped-left
      class="toolbar"
    >
      <v-toolbar-side-icon
        @click.stop="setMenuButtonMode"
        class="blue--text text--darken-2"
      >
      </v-toolbar-side-icon>
      <v-toolbar-title>{{ toolbarTitle }}</v-toolbar-title>
      <router-view name="toolbar"/>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-navigation-drawer
      app
      clipped
      floating
      v-model="drawer"
      :mini-variant="mini"
      mini-variant-width="64"
      width="250"
      class="transparent"
      stateless
    >
      <router-view name="navigation-drawer"/>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid pa-0>
        <router-view></router-view>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
  export default {
    name: "material-2-layout",
    data() {
      return {
        drawer: true,
        mini: false,
      };
    },
    methods: {
      // определение режима работы кнопки меню:
      // 0 - показывать и скрывать
      // 1 - показывать и минимизировать
      setMenuButtonMode() {
        return this.menuButtonMode
          ? this.mini = !this.mini
          : this.drawer = !this.drawer;
      }
    },
    props: ["toolbarTitle", "menuButtonMode"]
  }
</script>

<style scoped>
  .toolbar {
    background: #fff;
    box-shadow: inset 0 -1px 0 rgba(100, 121, 143, 0.122);
  }
</style>