<template>
	<v-container fill-height fluid pa-0 ma-0>
		<v-layout column>
			<v-flex>
        <v-layout column>
          <v-flex>
            <v-layout column>
              <v-flex xs12>
                <bread-crumbs :links="links" @linkChoiced="goToRoute" />
              </v-flex>
              <v-flex>
                <v-card v-bind:style="{'background-color': '#1a237e'}">
                  <v-flex py-3>
                    <h4 class='pt-3 pb-2 headline font-weight-medium text-xs-center white--text text--darken-3'>Ознакомьтесь с рекомендуемыми модулями</h4>
                    <h5 class='mx-3 subheading font-weight-regular text-xs-center grey--text text--lighten-3'>Модули - короткие самостоятельные учебные пособия, которые охватывают отдельные темы и задачи</h5>
                  </v-flex>
                  <v-flex py-2>
                    <v-divider />
                  </v-flex>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-layout mb-3>
            <v-flex>
              <!-- Filters -->
              <Filters :filters="availableFilters" @applyFilter="refreshModulesFilter"></Filters>
            </v-flex>
          </v-layout>
        </v-layout>
        <v-layout wrap row mx-2 mt-2 mb-4>
          <v-flex v-for='moduleData in modules' :key='moduleData.courseId' lg3 md4 sm6 xs12>
            <module-card v-if="moduleData"
              :item="moduleData"
              class="card-item"
              @click='goToModuleDetails(moduleData)' />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ModuleCard from './ModuleCard.vue'
import Filters from './LmsFilters.vue'
import { checkFiltersChanges, separateFilters } from '../helpers/filters.js'
import { getLinks } from '../helpers/navihelp.js'

export default {
  name: 'lms-modules',
  components: {
    ModuleCard,
    Filters
  },
  created() {
    if (this.$store.getters['lms/modules'] === null) {
      this.getModules()
    }
    if (this.$store.getters['lms/availableFilters'] === null) {
      this.getAvailableFilters()
    }
    let linksOld = this.$store.getters['lms/links']
    this.links = getLinks(this.title, this.$route, linksOld)
    this.$store.commit('lms/setLinks', this.links)
  },

  data() {
    return {
      filterChanged: false,
      modulesFiltered: [],
      title: 'Модули',
      links: null
    }
  },

  methods: {
    goToRoute(index) {
      this.$router.push({name: this.links[index].name, params: this.links[index].params})
    },
    goToModuleDetails(moduleData) {
      this.$router.push({name: 'LMSMODULEDETAILS',
        params: {
          moduleGuid: moduleData.moduleGuid,
          moduleName: moduleData.name,
        }
      })
    },
    getModules () {
      this.$store.dispatch('lms/getModules')
    },

    refreshModulesFilter: function(data) {
      var roles = []
      var levels = []
      var products = []
      var tags = []
      // проверить установленные фильтры
      const filters = data.currentFilters
      var setFilters = checkFiltersChanges(filters)

      // Если фильтры не установлены
      if (!setFilters) {
        this.filterChanged = false
      } else {
        this.filterChanged = true
        this.modulesFiltered.length = 0

        // разделить фильтры по категориям
        var separatedFilters = separateFilters (filters)
        roles = separatedFilters.roles
        levels = separatedFilters.levels
        products = separatedFilters.products
        tags = separatedFilters.tags

        // Отфильтровать модули по выбранным фильтрам
        var selectedListId = []
        for (let index = 0; index < this.allModules.length; index++) {
          const moduleData = this.allModules[index]
          // roles
          for (let itemIndex = 0; itemIndex <  moduleData.roles.length; itemIndex++) {
            const role = moduleData.roles[itemIndex]
            for (let indexFilter = 0; indexFilter < roles.length; indexFilter++) {
              if (role.code === roles[indexFilter].code
                  && !selectedListId.includes(moduleData.moduleGuid)) {
                selectedListId.push(moduleData.moduleGuid)
                this.modulesFiltered.push(moduleData)
              }
            }
          }
          // levels
          for (let itemIndex = 0; itemIndex < moduleData.levels.length; itemIndex++) {
            const level = moduleData.levels[itemIndex]
            for (let indexFilter = 0; indexFilter < levels.length; indexFilter++) {
              if (level.code === levels[indexFilter]
                  && !selectedListId.includes(moduleData.moduleGuid)) {
                selectedListId.push(moduleData.moduleGuid)
                this.modulesFiltered.push(moduleData)
              }
            }
          }
          // products
          for (let index = 0; index < moduleData.products.length; index++) {
            const product = moduleData.products[index]
            for (let indexFilter = 0; indexFilter < products.length; indexFilter++) {
              if (product.code === products[indexFilter].code
                  && !selectedListId.includes(moduleData.moduleGuid)) {
                selectedListId.push(moduleData.moduleGuid)
                this.modulesFiltered.push(moduleData)
              }
            }
          }
          // tags
          for (let index = 0; index < moduleData.tags.length; index++) {
            const tag = moduleData.tags[index]
            for (let indexFilter = 0; indexFilter < tags.length; indexFilter++) {
              if (tag.code === tags[indexFilter].code &&
                  !selectedListId.includes(moduleData.moduleGuid)) {
                selectedListId.push(moduleData.moduleGuid)
                this.modulesFiltered.push(moduleData)
              }
            }
          }
        }
      }
    }
  },
  computed: {
    availableFilters() {
      var filters = this.$store.getters['lms/availableFilters']
      // добавить поле-признак выбора
      if (filters) {
        for (let index = 0; index < filters.length; index++) {
          var filter = filters[index]
          for (let itemIndex = 0; itemIndex < filter.items.length; itemIndex++) {
            filter.items[itemIndex].selected = false
          }
        }
      }
      return filters
    },
    allModules() {
      return this.$store.getters['lms/modules']
    },
    modules() {
      if (this.filterChanged) {
        return this.modulesFiltered
      } else {
        return this.$store.getters['lms/modules']
      }
    }
  }
}
</script>

<style scoped>

</style>
