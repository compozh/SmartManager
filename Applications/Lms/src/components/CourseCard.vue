<template>
  <div>
        <v-card class='mx-2 my-2' hover height='278px'>
          <!-- Card header -->
					<v-layout v-bind:style="{'background-color': course.backgroundColor}">
						<v-flex ml-2 xs4 mt-2 mb-2>
							<v-img
								v-show="course.imageLink"
								v-bind:src='course.imageLink'
								height='80px'
								contain/>
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

          <!-- Card text -->
					<v-layout>
						<v-card-text class="px-6 py-2">
							<div style='height:118px;overflow:hidden' class="px-4">
								<h4 class='caption font-weight-medium' style='color:rgba(0,0,0,.5)'>{{course.type}}</h4>
								<h3 class='cardTitle subheading font-weight-medium mb-1 blue--text text--darken-4'
										@click='$router.push({name: "LMSCOURSEDETAILS", params: {courseGuid: course.courseGuid, courseName: course.name, courseData: course}})'>{{course.name}}
								</h3>
								<div class='.body-2'>{{course.description}}</div>
							</div>
						</v-card-text>
					</v-layout>

          <v-divider light></v-divider>

          <v-layout align-end justify-center row class='pa-2'>
						<v-icon
							id='favIcon'
							v-bind:color='course.isFavorite ? "red" : "grey"'
							@mouseenter='favIconColor = "red"'
							@mouseleave='favIconColor = "grey"'
							@click='changeFavoriteState(course)'
							>{{course.isFavorite === true ? 'favorite' : 'favorite_border'}}</v-icon>
						<!--
						<v-icon id='favIcon' v-bind:color='favIconColor' @mouseenter='favIconColor = "red"' @mouseleave='favIconColor = "grey"' @click='course.favIconStyle=(course.favIconStyle=="favorite"?"favorite_border":"favorite")'>{{course.units.length === 1 ? '' : 's'}}</v-icon>
						-->
						<v-spacer/>
						<v-chip small v-show="course.roles[0]" @click="roleSearch(course.roles[0])">{{course.roles[0] ? course.roles[0].name: null}}</v-chip>
						<v-chip small v-show="course.levels[0]" @click="levelSearch(course.levels[0])">{{course.levels[0] ? course.levels[0].name : null}}</v-chip>
					</v-layout>
				</v-card>
  </div>
</template>

<script>
export default {
  name: 'course-card',
  props: {
    course: Object
  }
}
</script>

<style>

</style>
