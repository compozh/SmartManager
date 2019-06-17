<template>
  <v-container ma-0 pa-0>
    <v-layout column>
      <v-flex text-xs-center>
        <h1 class="subheading text-uppercase font-weight-thin mb-3 pb-2">{{ getModule.title }}</h1>
      </v-flex>
      <v-flex>
        <v-layout row class="sub-menu">
          <v-flex xs4 v-for="(column, colIndex) in columnsCount" :key="colIndex">
            <v-layout column>
              <v-flex
                class="pa-3"
                v-for="(node, nodeIndex) in getModule.paragraphItem"
                v-if="colIndex === (nodeIndex + columnsCount) % columnsCount"
                :key="node.codeMenu"
              >
                <v-layout column>
                  <v-flex>
                    <h2 class="body-2 font-weight-bold text-uppercase ml-4 pb-1">
                      {{ node.name }}
                    </h2>
                  </v-flex>
                  <v-flex d-flex class="node-item" v-for="item in node.children">
                    <div class="icon">
                      <svg class="svg">
                        <use
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          :xlink:href="'#' + item.image"
                        ></use>
                      </svg>
                    </div>

                    <div>
                      <a v-if="item.linkToRMD" target="_blank" :href="BaseUrl + item.linkToRMD">{{
                        item.name
                      }}</a>
                      <span v-else>{{ item.name }}</span>
                    </div>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import getImage from './ConvetImage.js'

export default {
  name: 'it-module',
  data() {
    return {
      columnsCount: 3
    }
  },
  computed: {
    getModule() {
      if (this.$store.getters.getAppData('ITMODULE')) {
        if (!this.SvgCollection.length) {
          return []
        }
        let list = this.$store.getters.getAppData('ITMODULE').data.itmenu.moduleContent

        for (let object of list.paragraphItem) {
          let inspaction = ''
          object.children = object.children.filter(item => item.linkToRMD)
          for (let child of object.children) {
            if (!child) {
              break
            }
            child.image = getImage(child.image, this.SvgCollection)
          }
        }
        return list
      }
      return { paragraphItem: [] }
    },
    BaseUrl() {
      return this.$store.getters.getAppData('ITMENU').data.itmenu.menu.baseUrl + '/?par3=;ITCALL'
    },
    SvgCollection() {
      return this.$store.getters.getExistedIcons
    }
  },
  methods: {
    loadDataForComponents() {
      if (this.$route.params.module !== 'FAVORITE_MODULE' && this.$route.params.module) {
        let datasource = {
          query:
            ' { itmenu { moduleContent(codeMenu:"' +
            this.$route.params.module +
            '"){  title tooltip  paragraphItem{ name: text  image codeMenu  isFolder children: nodes{ linkToRMD name: text image codeMenu isFolder } } } } } ',
          schema: 'ITPORTAL'
        }
        let key = 'ITMODULE'
        this.$store.dispatch('WebApps/LoadDataForComponent', {
          datasource,
          key
        })
      } else {
        if (!this.$store.getters.getAppData('ITMENU')) {
          return
        }
        this.$store.commit('WebApps/setAppData', {
          key: 'ITMODULE',
          data: {
            data: {
              itmenu: {
                moduleContent: this.$store.getters.getAppData('ITMENU').data.itmenu.menu
                  .moduleContent
              }
            }
          }
        })
      }
    },
    // Функция для обновления данных при изменении роутинга
    beforeRouteUpdate(to, from, next) {
      this.loadDataForComponents()
    }
  },
  beforeMount() {
    this.loadDataForComponents()
  }
}
</script>

<style scoped>
.sub-menu {
  height: 83vh;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}

.icon {
  max-width: 25px;
}

.svg {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  fill: #757575;
}

.node-item:hover {
  background: rgba(0, 0, 0, 0.12);
}

a {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: #000;
}
</style>
