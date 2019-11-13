<template>
  <v-app id="mes-app">
    <!-- Меню -->
    <v-navigation-drawer v-if="initialWorkCenter && workCenter" app clipped mobile-break-point="false" hide-overlay :mini-variant="menuMiniMode">
      <router-view name="navigation-drawer"/>
    </v-navigation-drawer>
    <v-app-bar app fixed clipped-left extended :extension-height="3">
      <v-app-bar-nav-icon @click.stop="toggleMenuMode" v-if="initialWorkCenter && workCenter" color="black"></v-app-bar-nav-icon>
      <router-view name="toolbar"/>
      <v-progress-linear :id="linearLoader" slot="extension" v-if="linearLoader" :indeterminate="linearLoader" ma-0 height="5"></v-progress-linear>
    </v-app-bar>

    <!-- Контент -->
    <v-content>
      <v-container class="main-block" :key="mainContainerKey" :class="$route.name =='MESLOGIN' ? 'mes-login-form' : ''">
        <router-view v-if="$route.name =='MESLOGIN' || (initialWorkCenter && workCenter)" />
        <span class="mes-device-not-fixed" v-if="currentUser && initialWorkCenter && !workCenter">Зафиксируйтесь за рабочим центром</span>
      </v-container>
    </v-content>

    <!-- Выплывающие подсказки -->
    <template v-if="snackbar.visible">
      <v-snackbar
        :top="true"
        :multi-line="true"
        :timeout="5000"
        :color=snackbar.type
        @input="closeSnackbar"
        :value="true"
      >
        {{ snackbar.message }}
        <v-btn @click.native="closeSnackbar" text color="white">
          Закрыть
        </v-btn>
      </v-snackbar>
    </template>

    <!-- Диалоговое меню -->
    <v-dialog
      v-model="dialogLinearLoader.visible"
      :hide-overlay="false"
      persistent
      width="300"
    >
      <v-card
        color="#326DA8"
        dark
      >
        <v-card-text>
          {{dialogLinearLoader.message}}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
export default {
  name: 'mes-layout',
  data() {
    return {
      mainContainer: 0
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.authentication.currentUser
    },
    mainContainerKey() {
      return this.$store.getters['mes/mainContainerKey']
    },
    dialogLinearLoader() {
      return this.$store.getters['mes/dialogLinearLoader']
    },
    linearLoader() {
      return this.$store.getters['mes/linearLoader']
    },
    menuMiniMode() {
      return this.$store.getters['mes/menuMiniMode']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    initialWorkCenter() {
      return this.$store.getters['mes/initialWorkCenter']
    },
    mesSnackbar() {
      return this.$store.getters['mes/snackbar']
    },
    formioSnackbar() {
      return this.$store.getters['formio/snackbar']
    },
    snackbar() {
      return this.mesSnackbar.visible ? this.mesSnackbar : this.formioSnackbar
    }
  },
  methods: {
    toggleMenuMode() {
      this.$store.dispatch('mes/toggleMenuMiniMode')
    },
    closeSnackbar() {
      this.$store.commit('mes/closeSnackbar')
      this.$store.commit('formio/closeSnackbar')
    }
  }
}
</script>
<style type="text/css">
  html{
    font-family: Roboto;
    font-weight: 500;
    overflow-y: hidden;
  }
  body{
    overflow-y: hidden;
  }
  .main-block {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .v-toolbar__extension {
    padding: 0;
  }
  .v-list-item.v-list-item--link.theme--light {
    padding-left: 28px;
  }
  .v-badge--overlap .v-badge__badge {
    height: 19px !important;
    width: 19px !important;
    min-width: 19px;
    top: -10px;
    right: -10px;
  }
  .v-navigation-drawer--mini-variant .v-list-item__action, .v-navigation-drawer--mini-variant .v-list-item__avatar {
    justify-content: start !important;
  }
  .mes-device-not-fixed {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    font-weight: 500;
    color: red;
    opacity: 0.5;
    vertical-align: middle;
    height: 100%;
  }
  .v-dialog {
    box-shadow: none;
  }
  .v-tabs__wrapper {
    margin: 0 !important;
  }
  .v-icon.v-tabs__icon.v-tabs__icon--next {
    display: none;
  }
  .v-icon.v-tabs__icon.v-tabs__icon--prev {
    display: none;
  }
  /* vuetify2.0 */
  .grow-0 .flex {
    display: flex;
  }
  .theme--light.v-card>.v-card__text {
    color: rgba(0,0,0,.87);
  }
  .v-btn {
    letter-spacing: 0;
    margin: 6px 8px;
  }
  .v-tab {
    padding: 0;
  }
  .grid-item-data {
    font-size: 14px;
  }
  .v-toolbar__content {
    padding: 0 24px;
  }
  .v-toolbar__content .v-btn.v-btn--icon.v-size--default, .v-toolbar__extension .v-btn.v-btn--icon.v-size--default {
    height: 36px;
    width: 36px;
  }
  .v-toolbar__content>.v-btn.v-btn--icon:first-child, .v-toolbar__extension>.v-btn.v-btn--icon:first-child {
    margin-left: -6px;
  }
  .v-dialog>.v-card>.v-card__text {
    padding: 16px;
  }
  .theme--dark.v-progress-linear {
    margin-top: 14px !important;
  }
  .v-navigation-drawer__content .v-list .v-list-item__action {
    margin-right: 25px;
  }
  .v-application--is-ltr .v-tabs-bar.v-tabs-bar--is-mobile:not(.v-tabs-bar--show-arrows)>.v-slide-group__wrapper>.v-tabs-bar__content>.v-tab:first-child,
  .v-application--is-ltr .v-tabs-bar.v-tabs-bar--is-mobile:not(.v-tabs-bar--show-arrows)>.v-slide-group__wrapper>.v-tabs-bar__content>.v-tabs-slider-wrapper+.v-tab {
    margin: 0;
  }
  .work-centers-select-input .v-text-field__details {
    display: none;
  }
  .v-list-item.v-list-item--link.theme--light {
    padding-left: 22px;
  }
  .work-centers-select .v-select__slot input {
    padding-bottom: 0;
  }
  .tasks-list-block .v-progress-linear__content {
    background-color: rgba(50,109,168,.5);
    color: white;
  }
  .choices__item.choices__item--choice {
    text-align: center;
    padding: 10px 5px !important;
  }
  .v-speed-dial__list {
    padding: 0;
    width: 45px !important;
  }
  .search-field.theme--light.v-text-field>.v-input__control>.v-input__slot:before {
    border-color: rgba(0,0,0,.1);
  }
  .search-field label {
    left: 10px !important;
  }
  .search-field .v-text-field__details{
    display: none;
  }
  /*Mes Login Style*/
  .mes-login-form .flex {
    text-align: center;
    line-height: 64px;
  }
  .mes-login-form .flex a {
    color: #326DA8 !important;
  }
  .mes-login-form .v-btn.v-btn--contained {
    color: #326DA8 !important;
    background-color: white !important;
    border: 1px solid #326DA8 !important;
    box-shadow: none !important;
    min-width: 120px;
    height: 50px;
  }
  .mes-login-form .v-label {
    top: 1px;
  }
  .mes-login-form .layout {
    padding: 0 10px;
  }
  .mes-login-form .cyan--text {
    color: #326DA8!important;
    caret-color: #326DA8 !important;
  }
  .qr-code-stream .camera {
    width: auto !important;
    height: 80vh !important;
  }

  .formio-component {
        position: relative;
  }
</style>

