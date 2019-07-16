<template>
  <v-app>
    <v-toolbar
      app
      clipped-left
      class="toolbar"
    >
      <v-toolbar-side-icon
        @click.stop="menuBtn"
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
      :value="menuMode !== 'close'"
      :mini-variant="menuMode === 'mini'"
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

    <template v-if="message.type">
      <v-snackbar
        :multi-line="true"
        :timeout="5000"
        :color="message.type"
        :value="true"
        @input="closeMessage"
      >
        {{ message.text }}
        <v-btn icon @click.native="closeMessage">
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>
    </template>

  </v-app>
</template>

<script>
  export default {
    name: 'sm-layout',
    props: ['toolbarTitle'],
    data() {
      return {
        drawer: true,
        mini: false,
      };
    },
    methods: {
      menuBtn() {
        switch (this.menuMode) {
          case 'close':
            this.setMenuMode('open')
            break
          case 'open':
            this.setMenuMode('mini')
            break
          case 'mini':
            this.setMenuMode('close')
        }
      },
      closeMessage() {
        this.$store.commit('sm/setMessage', null);
      },
      goToAll() {
        this.$router.push({name: 'SMARTMANAGERTASKS', params: {foldercode: 'ALL'}})
      },
      setMenuMode(mode) {
        this.$store.commit('sm/setMenuMode', mode)
      }
    },
    computed: {
      message() {
        const message = this.$store.state.sm.message
        return message.type ? message : {
          type: '',
          text: `Нет сообщений для отображения`
        }
      },
      circularLoader() {
        return this.$store.state.sm.circularLoader
      },
      linearLoader() {
        return this.$store.state.sm.linearLoader
      },
      menuMode() {
        return this.$store.state.sm.menuMode
      },
      breakpoint() {
        return this.$vuetify.breakpoint.name
      }
    },
    created() {
      this.goToAll()
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'SMARTMANAGERLOGIN') {
          this.setMenuMode('close')
        }
        if (from.name === 'SMARTMANAGERLOGIN') {
          this.goToAll()
        }
      },
      breakpoint: function (val) {
        if (val === 'sm') {
          this.setMenuMode('mini')
        }
      }
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