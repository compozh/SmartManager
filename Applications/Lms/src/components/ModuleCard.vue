<template>
  <div>
    		<v-card class='mx-2 my-2' hover height='278px'>
          <!-- Course card header -->
					<v-layout v-bind:style="{'background-color': moduleData.backgroundColor}">
						<v-flex ml-2 mt-2 mb-2>
							<v-img
								v-show="moduleData.imageLink"
								v-bind:src='moduleData.imageLink'
								height='80px'
								contain/>
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

          <!-- Card text -->
          <v-layout>
            <v-card-text class="px-4 py-2">
              <div style='height:118px;overflow:hidden' class='mt-0 ml-3'>
  						  <h4 class='caption font-weight-medium' style='color:rgba(0,0,0,.5)'>{{moduleData.type}}</h4>
  						  <h3 class='cardTitle subheading font-weight-medium mb-1 blue--text text--darken-4'
  						  	@click='$router.push({name: "LMSMODULEDETAILS", params: {moduleGuid: moduleData.moduleGuid, moduleName: moduleData.name, moduleData: moduleData}})'>{{moduleData.name}}
  						  </h3>
						  <div class='.body-2'>{{moduleData.description}}</div>
					  </div>
            </v-card-text>
          </v-layout>

          <v-divider light></v-divider>

					<v-layout align-end justify-center row>
						<v-icon
							id='favIcon'
							v-bind:color='moduleData.isFavorite ? "red" : "grey"'
							@mouseenter='favIconColor = "red"'
							@mouseleave='favIconColor = "grey"'
							@click='moduleData.isFavorite = !moduleData.isFavorite'
							>{{moduleData.isFavorite === true ? 'favorite' : 'favorite_border'}}</v-icon>
						<!--
						<v-icon id='favIcon' v-bind:color='favIconColor' @mouseenter='favIconColor = "red"' @mouseleave='favIconColor = "grey"' @click='moduleData.favIconStyle=(moduleData.favIconStyle=="favorite"?"favorite_border":"favorite")'>{{moduleData.units.length === 1 ? '' : 's'}}</v-icon>
						-->
						<v-spacer/>
						<v-chip small v-show="moduleData.roles[0]"  @click="roleSearch(moduleData.roles[0])">{{moduleData.roles[0] ? moduleData.roles[0].name: null}}</v-chip>
						<v-chip small v-show="moduleData.levels[0]" @click="levelSearch(moduleData.levels[0])">{{moduleData.levels[0] ? moduleData.levels[0].name : null}}</v-chip>
					</v-layout>
				</v-card>
  </div>
</template>

<script>
export default {
  name: 'module-card',
  props: {
    moduleData: Object
  }
}
</script>

<style>

</style>
