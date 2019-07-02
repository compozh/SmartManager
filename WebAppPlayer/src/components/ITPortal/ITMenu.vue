<template>
  <v-container fluid ma-0 pa-0 text-xs-left>
    <it-icons class="all-svg" />
    <v-layout row class="layout">
      <v-flex v-if="menu" xs3 class="menu-list">
        <v-treeview
          :items="menuItems"
          item-key="codeMenu"
          hoverable
          open-on-click
          indeterminate-icon
        >
          <template slot="label" slot-scope="{ item }">
            <div v-if="item.isFolder" class="menu-item">
              <svg class="svg">
                <use
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  :xlink:href="'#' + item.image"
                ></use>
              </svg>
              <span class="menu-item-text" :title="item.name">{{ item.name }}</span>
            </div>
            <div v-else class="menu-item">
              <router-link
                class="none-link"
                :to="{ name: 'MODULECONTENT', params: LoadModuleContent(item) }"
              >
                <svg class="svg">
                  <use
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    :xlink:href="'#' + item.image"
                  ></use>
                </svg>
                <span class="menu-item-text" :title="item.name">{{ item.name }}</span>
              </router-link>
            </div>
          </template>
        </v-treeview>
      </v-flex>
      <v-flex xs9>
        <v-layout>
          <v-flex xs12>
            <div class="menu-content">
              <!-- Костыль -->
              <router-view name="module" v-if="this.$route.params.module"></router-view>
              <it-module v-if="!this.$route.params.module" />
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
//import ItIcons from "../../svgfiles/ItIcons.svg";
import getImage from './ConvetImage.js'

export default {
  name: 'it-menu',
  components: {
    //ItIcons
  },
  props: ['menu'],
  computed: {
    menuItems() {
      if (!this.SvgCollection.length) {
        return []
      }
      for (let object of this.menu.items) {
        if (!object.children) {
          object.children = []
        }
        if (!object.image == '') {
          object.image = object.image.toUpperCase()
        } else {
          object.image = 'IT'
        }
        let inspaction = ''
        for (let child of object.children) {
          if (!child) {
            break
          }
          child.image = getImage(child.image, this.SvgCollection)
        }
      }
      return this.menu.items
    },
    SvgCollection() {
      return this.$store.getters.getExistedIcons
    }
  },
  methods: {
    LoadModuleContent(item) {
      return { module: item.codeMenu }
    }
  },
  updated() {
    if (this.$store.getters.getExistedIcons.length === 0) {
      let arr = Array.from(document.getElementsByClassName('all-svg')[0].children).map(r => r.id)
      this.$store.commit('setExistedIcons', arr)
    }
  }
}
</script>

<style scoped>
.layout {
  height: 86vh;
}

.menu-list {
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
  margin-right: 50px;
}

.menu-item {
  display: flex;
  align-items: center;
}

.menu-item-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 300px;
}

.menu-content {
  display: block;
  float: left;
  width: 100%;
}

.none-link {
  color: black;
  text-decoration: none !important;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.svg {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  fill: #757575;
}
</style>
