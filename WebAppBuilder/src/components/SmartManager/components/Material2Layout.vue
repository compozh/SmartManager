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
      <v-progress-linear
        v-if="linearLoader"
        height="2"
        class="linear-loader"
        color="blue darken-2"
        :indeterminate="true"
      ></v-progress-linear>
    </v-toolbar>

    <v-navigation-drawer
      app
      clipped
      floating
      v-model="drawer"
      :mini-variant="menuMiniMode"
      mini-variant-width="56"
      width="270"
      class="transparent"
      stateless
    >
      <router-view name="navigation-drawer"/>
    </v-navigation-drawer>

    <v-content v-if="!circularLoader" class="white">
      <v-container fluid pa-0>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-container
      v-else
      class="circular-loader"
      fill-height fluid
    >
      <v-layout row align-center>
        <v-flex xs12>
          <v-progress-circular
            :size="100"
            :width="4"
            color="blue darken-2"
            indeterminate
          ></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>

    <template v-if="error">
      <v-snackbar
        :multi-line="true"
        :timeout="5000"
        color="error"
        @input="closeError"
        :value="true"
      >
        {{ error }}
        <v-btn flat dark @click.native="closeError"
        >Close
        </v-btn>
      </v-snackbar>
    </template>

  </v-app>
</template>

<script>
  import {eventBus} from '../../../main';

  export default {
    name: 'material-2-layout',
    props: ['toolbarTitle', 'menuButtonMode'],
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
      },
      closeError() {
        this.$store.commit('sm/setError', null);
      }
    },
    computed: {
      error() {
        return this.$store.getters['sm/error']
      },
      circularLoader() {
        return this.$store.getters['sm/circularLoader']
      },
      linearLoader() {
        return this.$store.getters['sm/linearLoader']
      },
      menuMiniMode() {
        eventBus.$emit('setMenuMode', this.mini);
        return this.mini;
      }
    },
    created() {
      eventBus.$on('setMenuMiniMode', value => {
        this.mini = value
      })
    },
    beforeDestroy() {
      eventBus.$off('setMenuMiniMode')
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