<template>
	<v-container fluid px-0 my-4>
		<v-layout>
			<v-flex xs12>
				<v-card v-bind:style="{'background-color': '#1a237e'}">
					<v-flex py-3>
						<h4 class='pt-3 pb-2 headline font-weight-medium text-xs-center white--text text--darken-3'>Ознакомьтесь с рекомендуемыми курсами</h4>
						<h5 class='mx-3 subheading font-weight-regular text-xs-center grey--text text--lighten-3'>Курсы обучения - ориентированные учебные пути, которые комплексно повышают ваши навыки работы</h5>
					</v-flex>
					<v-flex py-2>
						<v-divider />
					</v-flex>
					<!-- <v-layout py-3 row px-2>
						<v-spacer/>
						<v-layout column v-if="roles.length > 0">
							<h5 class='mx-2 body-2 font-weight-medium text-xs-left grey--text text--lighten-3'>Ваша роль</h5>
							<v-flex v-for='role in roles' v-bind:key="role.code" >
								<v-chip v-bind:outline="!role.selected" small @click="roleSearch(role)">{{role.name}}</v-chip>
							</v-flex>
						</v-layout>
						<v-layout column v-if="levels.length > 0">
							<h5 class='mx-2 body-2 font-weight-medium text-xs-left grey--text text--lighten-3'>Ваш уровень</h5>
							<v-flex v-for='level in levels' v-bind:key="level.code" >
								<v-chip v-bind:outline="!level.selected" small @click="levelSearch(level)">{{level.name}}</v-chip>
							</v-flex>
						</v-layout>
						<v-layout column v-if="products.length > 0">
							<h5 class='mx-2 body-2 font-weight-medium text-xs-left grey--text text--lighten-3'>Продукты</h5>
							<v-flex v-for='product in products' v-bind:key="product.code" >
								<v-chip v-bind:outline="!product.selected" small @click="productSearch(product)">{{product.name}}</v-chip>
							</v-flex>
						</v-layout>
						<v-layout column v-if="tags.length > 0">
							<h5 class='mx-2 body-2 font-weight-medium text-xs-left grey--text text--lighten-3'>Теги</h5>
							<v-flex v-for='tag in tags' v-bind:key="tag.code" >
								<v-chip v-bind:outline="!tag.selected" small @click="tagSearch(tag)">{{tag.name}}</v-chip>
							</v-flex>
						</v-layout>
					</v-layout> -->
				</v-card>
			</v-flex>
		</v-layout>
    <Filters :filters="availableFilters" @filterChanged="refreshCoursesFilter"></Filters>
		<v-layout wrap row>
			<!-- <v-flex mx-2 mt-4 mb-3>
			<h5 class='title font-weight-regular text-xs-left'>Курсы</h5>
			</v-flex> -->
		</v-layout>
			<v-layout wrap row>
				<v-flex v-for='course in courses' :key='course.courseId' lg3 md4 sm6 xs12>

          <course-card v-if="course" :course="course" />

					<!-- <v-card class='mx-2 my-2' style='margin: 0px 0px 0px 0px' hover height='280px'>
						<v-layout v-bind:style="{'background-color': course.backgroundColor}">
							<v-flex xs4 mt-3 mb-3>
								<v-img
									v-show="course.imageLink"
									v-bind:src='course.imageLink'
									height='80px'
									contain />
							</v-flex>
							<v-flex xs8>
								<v-card-title primary-title>
									<v-layout align-end justify-end column>
										<div :class='course.durationInfoClass' style='font-size:14px;font-weight:500'>{{course.durationMinutesLabel}}</div>
										<div :class='course.modulesQtInfoClass' style='font-size:14px;font-weight:400'>{{course.modulesQtLabel}}</div>
									</v-layout>
								</v-card-title>
							</v-flex>
						</v-layout>
						<div style='height:118px;overflow:hidden' class='mt-2 ml-3'>
							<h4 class='caption font-weight-medium' style='color:rgba(0,0,0,.5)'>{{course.type}}</h4>
							<h3 class='cardTitle subheading font-weight-medium mb-1 blue--text text--darken-4'
                  @click='$router.push({name: "LMSCOURSEDETAILS", params: {courseGuid: course.courseGuid, courseName: course.name, courseData: course}})'>
                  {{course.name}}
							</h3>
							<div class='.body-2'>{{course.description}}</div>
						</div>
						<v-divider light></v-divider>
						<v-layout align-end justify-center row>
							<v-icon
								id='favIcon'
								v-bind:color='course.isFavorite ? "red" : "grey"'
								@mouseenter='favIconColor = "red"'
								@mouseleave='favIconColor = "grey"'
								@click='changeFavoriteState(course)'
								>{{course.isFavorite === true ? 'favorite' : 'favorite_border'}}</v-icon>
							<v-spacer/>
							<v-chip small v-show="course.roles[0]" @click="roleSearch(course.roles[0])">{{course.roles[0] ? course.roles[0].name: null}}</v-chip>
							<v-chip small v-show="course.levels[0]" @click="levelSearch(course.levels[0])">{{course.levels[0] ? course.levels[0].name : null}}</v-chip>
						</v-layout>
					</v-card> -->

				</v-flex>
			</v-layout>
	</v-container>
</template>


<script>

import CourseCard from './CourseCard.vue'
import Filters from './LmsFilters.vue'

export default {
	name: 'lms-courses',
  created() {
    if (this.$store.getters['lms/courses'] === null) {
      this.getCourses()
    }
    if (this.$store.getters['lms/availableFilters'] === null) {
      this.getAvailableFilters()
    }
  },

  data() {
    return {
      filterChanged: false,
      allCourses: [],
      coursesFiltered: []
    }
  },

  methods: {
    getCourses () {
      this.$store.dispatch('lms/getCourses')
    },

    roleSearch: function(data) {
      this.$router.push({ name: 'LMSCOURSES', params: { role: data.code } })
    },
    levelSearch: function(data) {
      this.$router.push({ name: "LMSCOURSES", params: { level: data.code } })
    },

    refreshCoursesFilter: function(data) {
      var roles = []
      var levels = []
      var products = []
      var tags = []
      // проверить установленные фильры
      const filters = data.currentFilters
      var setFilters = false
      if (filters) {
        for (let index = 0; index < filters.length; index++) {
          const filter = filters[index]
          for (let itemIndex = 0; itemIndex< filter.items.length; itemIndex++) {
             if (filter.items[itemIndex].selected) {
               setFilters = true
               break
             }
          }
          if (setFilters) {
               break
          }
        }
      }
      // Если не установлены
      if (!setFilters) {
        this.filterChanged = false;
      } else {
        this.coursesFiltered.length = 0
        this.filterChanged = true;
        // разделить фильтры по категориям
        for (let index = 0; index < filters.length; index++) {
          var filter = filters[index]
          switch (filter.name) {
            case 'Роль':
              for (let index = 0; index < filter.items.length; index++) {
                if (filter.items[index].selected) {
                  roles.push(filter.items[index])
                }
              }
              break
            case 'Уровень':
              for (let index = 0; index < filter.items.length; index++) {
                if (filter.items[index].selected) {
                  levels.push(filter.items[index])
                }
              }
              break
            case 'Продукт':
              for (let index = 0; index < filter.items.length; index++) {
                if (filter.items[index].selected) {
                  products.push(filter.items[index])
                }
              }
              // products = filter.items
              break
            case 'Тэг':
              for (let index = 0; index < filter.items.length; index++) {
                if (filter.items[index].selected) {
                  tags.push(filter.items[index])
                }
              }
              // tags = filter.items
              break
          }
        }
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
             filter.items[itemIndex].selected = false;
          }
        }
      }
      return filters
    },

    courses () {
      if (this.filterChanged) {
        return this.coursesFiltered
      } else {
        this.allCourses = this.$store.getters['lms/courses']
        return this.allCourses
      }
    }
  },
}
</script>
