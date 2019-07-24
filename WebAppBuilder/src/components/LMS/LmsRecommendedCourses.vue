<template>
	<v-container fluid>
		<!-- <v-layout wrap row align-center justify-center>
			<v-flex v-for='course in recommendedCourses' :key='course.courseId' lg4 md4 sm6 xs122>
				<v-card class='mx-2 my-2' hover height='265px'>
					<v-layout v-bind:style="{'background-color': course.backgroundColor}">
						<v-flex ml-2 xs4 mt-2 mb-2>
							<v-card-media
								v-show="course.imageLink"
								v-bind:src='course.imageLink'
								height='80px'
								contain
							/>
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
							@click='$router.push({name: "courseDetails", params: {courseGuid: course.courseGuid, courseName: course.name, courseData: course}})'>{{course.name}}
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
				</v-card>
			</v-flex>
		</v-layout> -->
    <div v-for='(course, index) in recommendedCourses' :key="index">
      <p>{{course.name}}</p>
      <p>{{course.courseGuid}}</p>
    </div>
	</v-container>
</template>

<script>
var courseCardsData = [];

export default {
  name: "lms-recommended-courses",
  props: ['recommendedCourses'],
  data: () => ({
    favIconColor: "grey"
  }),
  methods: {
    changeFavoriteState: function(course){
      course.isFavorite = !course.isFavorite;

    },
    roleSearch: function(data) {
      //this.$router.push({ name: "courses", params: { role: data.code } });
    },
    levelSearch: function(data) {
      //this.$router.push({ name: "courses", params: { level: data.code } });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#favIcon {
  margin: 8px 0px 6px 8px;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}
.roleBtn {
  transform: translate(23px, 0px) scale(0.8);
}
.lvlBtn {
  transform: scale(0.8);
}
.roleBtn,
.lvlBtn {
  font-size: 13px;
  color: rgb(120, 120, 120) !important;
}
.v-card--hover {
  cursor: default !important;
}
.cardTitle,
.v-card__media {
  cursor: pointer;
}
</style>