<template>
	<v-container fill-height fluid pa-0 ma-0>
    <v-layout column>
      <v-flex >
        <v-layout column>
          <v-flex>
            <v-layout column>
              <v-flex xs12>
                <bread-crumbs :links="links" @linkChoiced="goToRoute" />
              </v-flex>
              <v-flex>
               <v-card v-bind:style="{'background-color': '#1a237e'}">
                  <v-flex py-3>
                    <h4 class='pt-3 pb-2 headline font-weight-medium text-xs-center white--text text--darken-3'>Ознакомьтесь с рекомендуемыми курсами</h4>
                    <h5 class='mx-3 subheading font-weight-regular text-xs-center grey--text text--lighten-3'>Курсы обучения - ориентированные учебные пути, которые комплексно повышают ваши навыки работы</h5>
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
               <Filters :filters="availableFilters" @applyFilter="refreshCoursesFilter"></Filters>
             </v-flex>
          </v-layout>
        </v-layout>
        <v-layout wrap row>
          <v-flex v-for='course in courses' :key='course.courseId' lg3 md4 sm6 xs12>
             <course-card v-if="course"
              :item="course"
              class="card-item"
              @click="goToCourseDetails(course)" />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
	</v-container>
</template>

<script>
import { checkFiltersChanges, separateFilters } from '../helpers/filters.js'
import { getLinks } from '../helpers/navihelp.js'

export default {
  name: 'lms-courses',
  created() {
    if (this.$store.getters['lms/courses'] === null) {
      this.getCourses()
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
      coursesFiltered: [],
      links: null,
      title: 'Курсы'
    }
  },

  methods: {
    goToRoute(index) {
      this.$router.push({name: this.links[index].name, params: this.links[index].params})
    },
    goToCourseDetails(course) {
      this.$router.push({name: 'LMSCOURSEDETAILS',
        params: { courseGuid: course.courseGuid }
      })
    },
    getCourses () {
      this.$store.dispatch('lms/getCourses')
    },

    roleSearch: function(data) {
      this.$router.push({ name: 'LMSCOURSES', params: { role: data.code } })
    },
    levelSearch: function(data) {
      this.$router.push({ name: 'LMSCOURSES', params: { level: data.code } })
    },

    refreshCoursesFilter: function(data) {
      var roles = []
      var levels = []
      var products = []
      var tags = []
      // проверить установленные фильры
      const filters = data.currentFilters
      var setFilters = checkFiltersChanges(filters)

      // Если не установлены
      if (!setFilters) {
        this.filterChanged = false
      } else {
        this.coursesFiltered.length = 0
        this.filterChanged = true

        // разделить фильтры по категориям
        var separatedFilters = separateFilters(filters)
        roles = separatedFilters.roles
        levels = separatedFilters.levels
        products = separatedFilters.products
        tags = separatedFilters.tags

        // отфильтровать курсы по установленному фильтру
        var selectedListId = []
        for (let index = 0; index < this.allCourses.length; index++) {
          const course = this.allCourses[index]
          // roles
          for (let index = 0; index < course.roles.length; index++) {
            const role = course.roles[index]
            for (let indexFilter = 0; indexFilter < roles.length; indexFilter++) {
              // Если у курса есть признак и не был выбран - добавить
              if (role.code === roles[indexFilter].code &&
                  !selectedListId.includes(course.courseGuid)) {
                selectedListId.push(course.courseGuid)
                this.coursesFiltered.push(course)
              }
            }
          }
          // levels
          for (let index = 0; index < course.levels.length; index++) {
            const level = course.levels[index]
            for (let indexFilter = 0; indexFilter < levels.length; indexFilter++) {
              // Если у курса есть признак и не был выбран - добавить
              if (level.code === levels[indexFilter].code &&
                  !selectedListId.includes(course.courseGuid)) {
                selectedListId.push(course.courseGuid)
                this.coursesFiltered.push(course)
              }
            }
          }
          // products
          for (let index = 0; index < course.products.length; index++) {
            const product = course.products[index]
            for (let indexFilter = 0; indexFilter < products.length; indexFilter++) {
              // Если у курса есть признак и не был выбран - добавить
              if (product.code === products[indexFilter].code &&
                  !selectedListId.includes(course.courseGuid)) {
                selectedListId.push(course.courseGuid)
                this.coursesFiltered.push(course)
              }
            }
          }
          // tags
          for (let index = 0; index < course.tags.length; index++) {
            const tag = course.tags[index]
            for (let indexFilter = 0; indexFilter < tags.length; indexFilter++) {
              // Если у курса есть признак и не был выбран - добавить
              if (tag.code === tags[indexFilter].code &&
                  !selectedListId.includes(course.courseGuid)) {
                selectedListId.push(course.courseGuid)
                this.coursesFiltered.push(course)
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
      // Добавить поле - признак выбора
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
    allCourses() {
      return this.$store.getters['lms/courses']
    },
    courses () {
      if (this.filterChanged) {
        return this.coursesFiltered
      } else {
        return this.$store.getters['lms/courses']
      }
    }
  },
}
</script>

<style>
.card-item:hover {
  cursor: pointer;
}
</style>
