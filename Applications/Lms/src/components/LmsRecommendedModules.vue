<template>
	<v-container fluid>
		<v-layout wrap row align-center justify-center>
			<v-flex v-for='moduleData in recommendedModules' :key='moduleData.courseId' lg4 md4 sm6 xs12>
				<v-card class='mx-2 my-2' hover height='225px'>
					<v-layout>
						<v-flex ml-2 mt-2 mb-2>
							<v-img
								v-show="moduleData.imageLink"
								v-bind:src='moduleData.imageLink'
								height='80px'
								contain
							/>
						</v-flex>
						<v-flex xs8>
							<v-card-title primary-title>
								<v-layout align-end justify-start column>
									<div style='font-size:14px;font-weight:500'>{{moduleData.durationMinutesLabel}}</div>
									<div class='grey--text mt-1' style='font-size:14px;font-weight:400'>{{moduleData.lessonsQtLabel}}</div>
								</v-layout>
							</v-card-title>
						</v-flex>
					</v-layout>
					<div style='height:88px;overflow:hidden' class='mt-0 ml-3'>
						<h4 class='caption font-weight-medium' style='color:rgba(0,0,0,.5)'>{{moduleData.type}}</h4>
						<h3 class='cardTitle subheading font-weight-medium mb-1 blue--text text--darken-4'
							@click='$router.push({name: "moduleDetails", params: {moduleGuid: moduleData.moduleGuid, moduleName: moduleData.name, moduleData: moduleData}})'>{{moduleData.name}}
						</h3>
						<div class='.body-2'>{{moduleData.description}}</div>
					</div>
					<v-divider light></v-divider>
					<v-layout align-end justify-center row>
						<v-icon
							id='favIcon'
							v-bind:color='moduleData.isFavorite ? "red" : "grey"'
							@mouseenter='favIconColor = "red"'
							@mouseleave='favIconColor = "grey"'
							@click='moduleData.isFavorite = !moduleData.isFavorite'
							>{{moduleData.isFavorite === true ? 'favorite' : 'favorite_border'}}</v-icon>
						<v-spacer/>
						<v-chip small v-show="moduleData.roles[0]"  @click="roleSearch(moduleData.roles[0])">{{moduleData.roles[0] ? moduleData.roles[0].name: null}}</v-chip>
						<v-chip small v-show="moduleData.levels[0]" @click="levelSearch(moduleData.levels[0])">{{moduleData.levels[0] ? moduleData.levels[0].name : null}}</v-chip>
					</v-layout>
				</v-card>
			</v-flex>
		</v-layout>

	</v-container>
</template>

<script>
var moduleCardsData = [];

export default {
  name: 'lms-recommended-modules',
  props: ['recommendedModules'],
  data: () => ({
    favIconColor: 'grey'
  }),
  methods: {
    changeFavoriteState: function(moduleData) {
      moduleData.isFavorite = !moduleData.isFavorite

    },
    roleSearch: function(data) {
      //this.$router.push({ name: "modules", params: { role: data.code } });
    },
    levelSearch: function(data) {
      //this.$router.push({ name: "modules", params: { level: data.code } });
    }
  }
}
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
