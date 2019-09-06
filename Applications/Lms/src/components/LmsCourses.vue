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
    <Filters :filters="availableFilters"></Filters>
		<v-layout wrap row>
			<v-flex mx-2 mt-4 mb-3>
			<h5 class='title font-weight-regular text-xs-left'>Курсы</h5>
			</v-flex>
		</v-layout>
			<v-layout wrap row>
				<v-flex v-for='course in courses' :key='course.courseId' lg3 md4 sm6 xs12>
					<v-card class='mx-2 my-2' style='margin: 0px 0px 0px 0px' hover height='280px'>
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
                  @click="goToCourseDetails(course.courseGuid, course)">
                <!-- @click='$router.push({name: "LMSCOURSEDETAILS", params: {courseGuid: course.courseGuid, courseName: course.name, courseData: course}})' -->
                <!-- <router-link></router-link> -->
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
							<!-- <v-chip small v-show="course.roles[0]" @click="roleSearch(course.roles[0])">{{course.roles[0] ? course.roles[0].name: null}}</v-chip>
							<v-chip small v-show="course.levels[0]" @click="levelSearch(course.levels[0])">{{course.levels[0] ? course.levels[0].name : null}}</v-chip> -->
						</v-layout>
					</v-card>
				</v-flex>
			</v-layout>
	</v-container>
</template>


<script>
// import { threadId } from 'worker_threads'

export default {
	name: 'lms-courses',
  created() {
    if (this.$store.getters['lms/courses'] === null) {
      this.getCourses()
    }
  },

  methods: {
    getCourses () {
      this.$store.dispatch('lms/getCourses')
    },

    goToCourseDetails ( courseId, course ) {
      this.$router.push({ name: 'LMSCOURSEDETAILS', params: {courseGuid: courseId, courseName: course.name, courseData: course}})
    },

    roleSearch: function(data) {
      this.$router.push({ name: 'LMSCOURSES', params: { role: data.code } })
    },
    levelSearch: function(data) {
      this.$router.push({ name: "LMSCOURSES", params: { level: data.code } })
    }
  },
  computed: {
    availableFilters() {
      return this.$store.getters['lms/availableFilters']
    },
    courses () {
      return this.$store.getters['lms/courses']
    }
  },
}
</script>
