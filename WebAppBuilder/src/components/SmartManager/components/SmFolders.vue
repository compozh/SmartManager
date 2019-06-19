<template>
  <v-container fluid pa-0>
    <v-layout column>
      <v-flex xs12 row>
        <v-list dense class="menu">
          <v-list-tile
            v-for="folder in folders"
            :key="folder.code"
            :to="{ name:'SMARTMANAGERTASKS', params:{ foldercode: (folder.code ||'ALL') }}"
            active-class="sm_active-folder"
            class="menu-item"
            :class="{ 'main-folder': isMainFolder(folder) }"
          >
            <v-list-tile-action>
              <v-tooltip
                right
                :disabled=!menuMiniMode
              >
                <template v-slot:activator="{ on }">
                  <div v-on="on">
                    <v-badge color="red darken-2">
                      <template
                        v-if="folder.count && menuMiniMode"
                        v-slot:badge
                      >
                        {{ folder.count }}
                      </template>
                      <v-icon>{{ setFolderIcon(folder) }}</v-icon>
                    </v-badge>
                  </div>
                </template>
                <span>{{ setMainFolderName(folder) }}</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                <span :style="{ 'font-weight': folder.count ? 500 : '' }">
                  {{ setMainFolderName(folder) }}
                </span>
              </v-list-tile-title>
            </v-list-tile-content>
            <v-spacer></v-spacer>
            <v-list-tile-action v-if="folder.count">
              <v-list-tile-action-text>
                {{ folder.count }}
              </v-list-tile-action-text>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {eventBus} from "../../../main"

  export default {
    name: "sm-folders",
    //props: ["folders"],
    data() {
      return {
        menuMiniMode: false
      }
    },
    computed: {
      loading() {
        return this.$store.getters.loading
      },
      folders() {
        return this.$store.getters.folders
      }
    },
    methods: {
      getFolders() {
        this.$store.dispatch('getFolders')
      },
      isMainFolder(folder) {
        return folder.name === 'Все'
      },
      setMainFolderName(folder) {
        return this.isMainFolder(folder) ? 'Активные' : folder.name
      },
      setFolderIcon(folder) {
        return this.isMainFolder(folder) ? 'folder' : 'folder_open'
      }
    },
    created() {
      this.getFolders()
      eventBus.$on('updateMenuMode', menuMiniMode => {
        this.menuMiniMode = menuMiniMode;
      })
    },
    beforeDestroy() {
      eventBus.$off('updateMenuMode')
    }
  }
</script>

<style>
  /* Общие стили для меню */
  .menu {
    display: flex;
    flex-direction: column;
  }

  .menu-item.main-folder {
    order: -1;
  }

  .menu-item a {
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    box-sizing: border-box;
    margin-right: 10px;
    padding-left: 40px;
    max-height: 30px;
    font-size: 14px !important;
  }

  .menu-item.main-folder a {
    padding-left: 25px;
  }

  .menu-item a .v-list__tile__action {
    justify-content: flex-start;
    min-width: 40px;
    color: rgba(0, 0, 0, .54);
  }

  /* Стили для активного пункта, когда меню в развернутом виде */
  .sm_active-folder {
    border-left: none;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    background: #ededed;
    font-weight: 500;
  }

  /* Стили для активного пункта, когда меню в свернутом виде */
  .v-navigation-drawer--mini-variant .menu-item .sm_active-folder,
  .v-navigation-drawer--mini-variant .menu-item .v-list__tile--link:hover {
    background: none;
  }

  .v-navigation-drawer--mini-variant .menu-item a {
    padding-left: 25px !important;
  }

  .v-navigation-drawer--mini-variant .menu-item .sm_active-folder i {
    background: #ededed;
    border-radius: 50%;
    box-shadow: 0 0 0 7px #ededed;
  }

  .v-navigation-drawer--mini-variant .menu-item i:hover {
    color: #888888;
  }

  /* Стили для иконок с количеством элементов */
  .v-badge__badge {
    /*visibility: hidden;*/
    top: -2px;
    right: -8px;
    height: 17px;
    width: 17px;
    font-size: 9px;
    font-weight: 100;
    align-content: center;
  }

  /* Медиазапрос для подражания поведению тулбара на xs экранах */
  @media only screen and (max-width: 959px) {
    .menu-item.main-folder a {
      padding-left: 16px;
    }

    .menu-item a {
      padding-left: 31px;
    }

    .v-navigation-drawer--mini-variant .menu-item a {
      padding-left: 16px !important;
    }
  }

</style>