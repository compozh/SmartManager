<template>
	<v-container mt-5>
		<v-layout>
			<v-flex>
				<v-text-field
					flat
					prepend-inner-icon="search"
					placeholder="Search"
					v-model="searchParams.phrase"
					@input="searchPhraseChanged"
					@keyup.native.enter="searchPhraseChangedForce"></v-text-field>
			</v-flex>
		</v-layout>
		<h5 class='title font-weight-regular text-xs-left mx-2 mt-3 mb-4'>{{searchResult.resultsQt}} Результатов</h5>
		<v-layout wrap row>
			<v-flex v-for='moduleData in moduleCards' :key='moduleData.courseId' xs12>
				<v-card class='mx-2 my-2' hover>
					<v-layout>
						<v-flex xs2 sm1 ml-2 mt-3 mb-2>
							<v-card-media
								v-show="moduleData.imageLink"
								v-bind:src='moduleData.imageLink'
								height='40px'
								contain/>
						</v-flex>
						<v-flex ml-2 mt-3>
							<h4 class='caption font-weight-medium' style='color:rgba(0,0,0,.5)'>{{moduleData.type}}</h4>
							<h3 class='cardTitle subheading font-weight-medium mb-1 blue--text text--darken-4'
								@click='$router.push({name: "moduleDetails", params: {moduleGuid: moduleData.moduleGuid, moduleName: moduleData.name, moduleData: moduleData}})'>{{moduleData.name}}
							</h3>
						</v-flex>
					</v-layout>
					<div style='overflow:hidden' class='mt-0 mb-2 ml-3'>
						<div class='.body-2'>{{moduleData.description}}</div>
					</div>
					<v-divider light></v-divider>
					<v-layout align-center justify-center row>
						<v-icon
							id='favIcon'
							v-bind:color='moduleData.isFavorite ? "red" : "grey"'
							@mouseenter='favIconColor = "red"'
							@mouseleave='favIconColor = "grey"'
							@click='moduleData.isFavorite = !moduleData.isFavorite'
							>{{moduleData.isFavorite === true ? 'favorite' : 'favorite_border'}}</v-icon>
						<v-spacer/>
						<v-chip small v-show="moduleData.roles[0]" @click="cardsRoleSearch(moduleData.roles[0])">{{moduleData.roles[0] ? moduleData.roles[0].name: null}}</v-chip>
						<v-chip small v-show="moduleData.levels[0]" @click="cardsLevelSearch(moduleData.levels[0])">{{moduleData.levels[0] ? moduleData.levels[0].name : null}}</v-chip>
					</v-layout>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
var moduleCardsData = [];
var searchResultData = {
  resultsQt: 10,
  results: []
};
var searchTimeoutId = 0;
var searchParamsData = { phrase: "" };
export default {
  name: "lms-search",
  beforeCreate() {},
  created() {},
  mounted() {
  },
  beforeUpdate() {},
  data: () => ({
    favIconColor: "grey",
		searchParams: searchParamsData,
    searchResult: searchResultData,
    moduleCards: moduleCardsData
  }),
  methods: {
    searchPhraseChanged: function() {
      //при вводе поискового запроса, запустить поиск в случае, если уже три секунды ничего не вводят
      if (searchTimeoutId > 0) {
        clearTimeout(searchTimeoutId);
      }
      if (this.searchPhrase != "") {
        // searchTimeoutId = setTimeout(
        //   () => this.$router.push("/search/" + this.searchParams.phrase),
        //   3000
        // );
      }
    },
    searchPhraseChangedForce: function() {
      //при вводе поискового запроса, запустить поиск в случае, если уже три секунды ничего не вводят
      if (searchTimeoutId > 0) {
        clearTimeout(searchTimeoutId);
      }
      //this.$router.push("/search/" + this.searchParams.phrase);
		},
    changeFavoriteState: function(moduleData) {
      moduleData.isFavorite = !moduleData.isFavorite;
      // this.runCalculation({
      //   serviceName: "LMS.MODULES.SETFAVORITE",
      //   parameters: {
      //     moduleId: moduleData.courseGuid,
      //     isFavorite: moduleData.isFavorite
      //   }
      // });
    },
    roleSearch: function(data) {
      //this.$router.push({ name: "modules", params: { role: data.code } });
    },
    levelSearch: function(data) {
      //this.$router.push({ name: "modules", params: { level: data.code } });
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
