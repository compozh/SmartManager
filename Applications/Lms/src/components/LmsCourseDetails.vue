<template>
	<v-container fluid px-0 my-4>
		<!--COURSE HEADER-->
		<v-layout my-2>
			<v-flex xs12>
				<v-card v-if="course.data" v-bind:style="{'background-color': course.data.backgroundColor}">
					<v-layout wrap row justify-center>
						<v-flex md1 xs2 class='pt-5' hidden-xs-only>
							<v-card-media v-bind:src='course.data.imageLink' height='90px' contain/>
						</v-flex>
						<v-flex lg6 md10 sm10 xs12>
							<v-card-text :class='course.data.courseTypeInfoClass'>{{course.data.type}}</v-card-text>
							<v-card-title :class='course.data.courseNameInfoClass'>{{course.data.name}}</v-card-title>
							<v-card-text :class='course.data.courseDescriptionInfoClass'>{{course.data.description}}</v-card-text>
							<v-layout row wrap>
								<v-flex md3 xs6>
									<v-card-text :class='course.data.courseDetailedDurationInfoClass'>{{course.data.durationMinutesLabel}}</v-card-text>
								</v-flex>
								<v-spacer/>
								<v-flex xs12>
									<v-layout align-top justify-start row wrap>
										<v-chip small v-for='role in course.data.roles' v-bind:key="role.code" @click="roleSearch(role)">{{role.name}}</v-chip>
										<v-chip small v-for='level in course.data.levels' v-bind:key="level.code" @click="levelSearch(level)">{{level.name}}</v-chip>
										<v-chip small v-for='product in course.data.products' v-bind:key="product.code" @click="productSearch(product)">{{product.name}}</v-chip>
										<v-chip small v-for='tag in course.data.tags' v-bind:key="tag.code" @click="tagSearch(tag)">{{tag.name}}</v-chip>
										<v-layout align-top justify-end row mx-3>
											<v-icon
												id='favIcon'
												v-bind:color='course.isFavorite ? "red" : "grey"'
												@mouseenter='favIconColor = "red"'
												@mouseleave='favIconColor = "white"'
												@click='changeFavoriteState(course)'>{{course.data.isFavorite === true ? 'favorite' : 'favorite_border'}}</v-icon>
										</v-layout>
									</v-layout>
								</v-flex>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-card>
			</v-flex>
		</v-layout>

		<!--MODULES CONT-->
		<!-- <v-layout align-center justify-center>
			<v-flex lg6 md10 sm10 xs12>
				<h5 class='title font-weight-regular text-xs-left mx-2 mt-3 mb-4'>Модули</h5>
				<v-layout wrap column >
					<v-flex v-for='moduleItem in modules.data' :key='moduleItem.moduleGuid'>
						<v-card class='my-2' hover >
							<v-layout row class='pb-0'>
								<v-flex xs2 md2 class='mt-2 ml-4 mr-2 mb-2'>
									<v-card-media v-bind:src='moduleItem.imageLink' height='80px' contain/>
								</v-flex>
								<v-flex xs10 class='mt-0'>
									<v-card-title primary-title >
										<v-layout align-start justify-end column>
											<div class='light-blue--text text--darken-4 title'>{{moduleItem.name}}</div>
											<div class='black--text pt-2'>{{moduleItem.description}}</div>
										</v-layout>
									</v-card-title>
								</v-flex>
							</v-layout>
							<v-layout reverse column>
								<v-flex xs12>
									<v-list two-line class='py-0 ml-0'>
										<v-list-group>
											<v-list-tile slot="activator" v-bind:style='{"height":"48px"}'>
												<v-list-tile-content class='pb-4'>
													<v-list-tile-title class='blue--text text--darken-4'>{{moduleItem.showLessonsTitle}}</v-list-tile-title>
												</v-list-tile-content>
											</v-list-tile>
											<v-list-tile v-for='lesson in moduleItem.units' :key='lesson.lessonGuid' @click='$router.push({name: "lesson", params: {
															lessonData: lesson,
															lessonName: lesson.name,
															moduleName: moduleItem.name,
															courseGuid: course.data.courseGuid,
															lessonGuid: lesson.lessonGuid,
														}})'>
												<v-list-tile-content class='pr-2'>
													<v-list-tile-title class='blue--text text--darken-4 font-weight-medium'>{{lesson.name}}</v-list-tile-title>
													<v-list-tile-sub-title>{{lesson.durationMinutes}} mins</v-list-tile-sub-title>
												</v-list-tile-content>
												<v-list-tile-action>
													<v-btn icon ripple>
														<v-icon color="grey lighten-1">info</v-icon>
													</v-btn>
												</v-list-tile-action>
											</v-list-tile>
											<v-divider/>
										</v-list-group>
									</v-list>
								</v-flex>
							</v-layout>
							<v-card-actions>
								<v-btn flat color="teal darken-4" @click='$router.push({name: "moduleDetails", params: {moduleGuid: moduleItem.moduleGuid, moduleName: moduleItem.name, moduleData: moduleItem}})'>Начать</v-btn>
							</v-card-actions>
						</v-card>
					</v-flex>
				</v-layout>
			</v-flex>


			<v-flex xs3 class='py-5 px-4' v-if="course.data" v-show="course.data.additionalInfo">
				<h3>Про этот курс</h3>
				<p>{{course.data.additionalInfo}}</p>
			</v-flex>
		</v-layout> -->
	</v-container>
</template>

<script>

export default {
  name: "lms-course-details",
  props: ["coursedetails"],
  created() {
    this.courseGuid = this.$route.params.courseGuid;
    this.course.data = this.$route.params.courseData
  },
  data() {
    return {
      courseGuid : "",
      course : { data: undefined },
      modules : { data: undefined }
    }
  }
}
</script>

<style scoped>

</style>
