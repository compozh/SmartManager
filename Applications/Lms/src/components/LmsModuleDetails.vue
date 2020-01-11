<template>
	<v-container fluid pa-0 ma-0>
		<!--MODULE HEADER-->
		<v-layout mb-4>
			<v-flex id='modulesHeader'>
        <v-card >
          <v-breadcrumbs :items="links" divider=">"></v-breadcrumbs>
        </v-card>
				<v-card v-if="moduleData.data">
					<v-layout wrap row justify-center>
						<v-flex md1 xs2 class='pt-3' hidden-xs-only>
							<v-card-media v-bind:src='moduleData.data.imageLink' height='80px' contain/>
						</v-flex>
						<v-flex lg8 md10 sm10 xs12>
							<v-card-text class='title font-weight-regular pt-4 pb-1' color="#424242">{{moduleData.data.type}}</v-card-text>
							<v-card-title class='display-1 font-weight-medium pt-0 pb-2' color="#424242">{{moduleData.data.name}}</v-card-title>
							<v-card-text class='body-2 font-weight-medium pt-0 pb-3' color="#424242">{{moduleData.data.description}}</v-card-text>
							<v-layout row wrap>
								<v-flex md2 xs6>
                  <v-card-text class='body-2 font-weight-medium pt-0 pb-1' color="#424242">{{moduleData.data.lessonsQtLabel}}</v-card-text>
									<v-card-text class='body-2 font-weight-medium pt-0 pb-4' color="#424242">{{moduleData.data.durationMinutesLabel}}</v-card-text>
								</v-flex>
								<v-spacer/>
								<v-flex xs12 mx-3>
									<v-layout align-top justify-start row wrap>
										<!-- <v-chip small v-for='role in moduleData.data.roles' v-bind:key="role.code" @click="roleSearch(role)">{{role.name}}</v-chip>
										<v-chip small v-for='level in moduleData.data.levels' v-bind:key="level.code" @click="levelSearch(level)">{{level.name}}</v-chip>
										<v-chip small v-for='product in moduleData.data.products' v-bind:key="product.code" @click="productSearch(product)">{{product.name}}</v-chip>
										<v-chip small v-for='tag in moduleData.data.tags' v-bind:key="tag.code" @click="tagSearch(tag)">{{tag.name}}</v-chip> -->
										<v-layout align-top justify-end row>
											<v-icon
												id='favIcon'
												v-bind:color='moduleData.data.isFavorite ? "red" : "grey"'
												@mouseenter='favIconColor = "red"'
												@mouseleave='favIconColor = "grey"'
												@click='changeFavoriteState(moduleData.data)'>{{moduleData.data.isFavorite === true ? 'favorite' : 'favorite_border'}}</v-icon>
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
		<v-layout v-if="moduleData.data" align-center justify-center>
			<!--<v-flex xs9 style='border-right: darkgrey 1px solid'>!-->
			<v-flex lg8 md10 sm10 xs12>
				<v-layout wrap column>
					<v-card class='mt-1 mb-0' hover>
						<v-layout reverse column>
							<v-flex xs12>
								<v-list two-line class='py-0' expand>
									<v-list-group value='true'>
										<v-list-tile slot="activator" v-bind:style='{"height":"48px"}'>
											<v-list-tile-content class='pb-4'>
												<v-list-tile-title class='blue--text text--darken-4'>{{moduleData.data.lessonsQtLabel}}</v-list-tile-title>
											</v-list-tile-content>
										</v-list-tile>
										<v-list-tile
											v-for='lesson in moduleData.data.units'
											:key='lesson.lessonGuid'
											@click='$router.push({name: "LMSMODULELESSON", params: {
												moduleGuid: moduleGuid,
                        moduleData: moduleData,
												lessonGuid: lesson.lessonGuid,
											}})'>
											<v-list-tile-content class='px-2'>
												<v-list-tile-title class='blue--text text--darken-4 font-weight-medium'>{{lesson.name}}</v-list-tile-title>
												<v-list-tile-sub-title>{{lesson.durationMinutesLabel}}</v-list-tile-sub-title>
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
					</v-card>
				</v-layout>
			</v-flex>

			<!--RIGHT PANEL-->
			<v-flex xs3 class='py-5 px-4' v-if="moduleData.data" v-show="moduleData.data.additionalInfo">
				<h3>Про этот курс</h3>
				<p>{{moduleData.data.additionalInfo}}</p>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>

export default {
  name: 'lms-module-details',
  created() {
    this.moduleGuid = this.$route.params.moduleGuid
    this.moduleData.data = this.$route.params.moduleData
  },
  data() {
    return {
      moduleGuid: '',
      moduleData: { data: undefined },
      lessons: { data: undefined }
    }
  },
  computed: {
    links() {
      let inputLinks = this.$route.params.links
      let links = [...inputLinks,
        {
          text: this.$route.params.moduleName,
          disabled: true,
          href: this.$route.path
        }]
      links[links.length - 2].disabled = false
      return links
    }
  }
}
</script>

<style scoped>

</style>
