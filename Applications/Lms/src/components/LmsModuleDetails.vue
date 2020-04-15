<template>
	<v-container fill-height fluid pa-0 ma-0>
		<v-layout justify-center fill-height>
      <v-flex v-if="!circularLoader">
        <!--MODULE HEADER-->
        <v-layout mb-4>
          <v-flex xs12>
            <bread-crumbs :links="links" @linkChoiced="goToRoute" />
            <v-card v-if="moduleData">
              <v-layout wrap row justify-center>
                <v-flex md1 xs2 class='pt-3' hidden-xs-only>
                  <v-img v-bind:src='moduleData.imageLink' height='80px' contain/>
                </v-flex>
                <v-flex lg8 md10 sm10 xs12>
                  <v-card-text class='title font-weight-regular pt-4 pb-1' color="#424242">{{moduleData.type}}</v-card-text>
                  <v-card-title class='display-1 font-weight-medium pt-0 pb-2' color="#424242">{{moduleData.name}}</v-card-title>
                  <v-card-text class='body-2 font-weight-medium pt-0 pb-3' color="#424242">{{moduleData.description}}</v-card-text>
                  <v-layout row wrap>
                    <v-flex md2 xs6>
                      <v-card-text class='body-2 font-weight-medium pt-0 pb-1' color="#424242">{{moduleData.lessonsQtLabel}}</v-card-text>
                      <v-card-text class='body-2 font-weight-medium pt-0 pb-4' color="#424242">{{moduleData.durationMinutesLabel}}</v-card-text>
                    </v-flex>
                    <v-spacer/>
                    <v-flex xs12 mx-3>
                      <v-layout align-top justify-start row wrap>
                        <v-layout align-top justify-end row>
                          <v-icon
                            id='favIcon'
                            v-bind:color='moduleData.isFavorite ? "red" : "grey"'
                            @mouseenter='favIconColor = "red"'
                            @mouseleave='favIconColor = "grey"'
                            @click='changeFavoriteState(moduleData)'>{{moduleData.isFavorite === true ? 'favorite' : 'favorite_border'}}</v-icon>
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
        <v-layout v-if="moduleData" align-center justify-center>
          <v-flex lg8 md10 sm10 xs12>
            <v-layout wrap column>
              <v-card class='mt-1 mb-0' hover>
                <v-layout reverse column>
                  <v-flex xs12>
                    <v-list two-line class='py-0' expand>
                      <v-list-group value='true'>
                        <v-list-tile slot="activator" v-bind:style='{"height":"48px"}'>
                          <v-list-tile-content class='pb-4'>
                            <v-list-tile-title class='blue--text text--darken-4'>{{moduleData.lessonsQtLabel}}</v-list-tile-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile
                          v-for='lesson in moduleData.units'
                          :key='lesson.lessonGuid'>
                          <!-- @click='$router.push({name: "LMSMODULELESSON", params: {
                            moduleGuid: moduleGuid,
                            moduleData: moduleData,
                            lessonGuid: lesson.lessonGuid,
                          }})' -->
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
          <v-flex xs3 class='py-5 px-4' v-if="moduleData" v-show="moduleData.additionalInfo">
            <h3>Про этот курс</h3>
            <p>{{moduleData.additionalInfo}}</p>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex v-else align-self-center>
        <v-layout align-center justify-space-between column fill-height>
          <v-flex >
            <!-- align-self-center -->
            <v-progress-circular
              :value="80"
              :size="100"
              :width="10"
              indeterminate
              color="blue-grey">
            </v-progress-circular>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
	</v-container>
</template>

<script>
import { getLinks } from '../helpers/navihelp.js'

export default {
  name: 'lms-module-details',
  created() {
    this.moduleGuid = this.$route.params.moduleGuid
    const moduleData = this.moduleData
    const moduleIdLoaded = moduleData ? moduleData.units.length !== 0 : false
    if (!moduleIdLoaded) {
      this.$store.dispatch('lms/getModules')
    }

    let linksOld = this.$store.getters['lms/links']
    this.links = getLinks(this.moduleData.name, this.$route, linksOld)
    this.$store.commit('lms/setLinks', this.links)
  },
  data() {
    return {
      moduleGuid: '',
      links: null
    }
  },
  methods: {
    goToRoute(index) {
      this.$router.push({name: this.links[index].name, params: this.links[index].params})
    },
  },
  computed: {
    circularLoader() {
      return this.$store.getters['lms/circularLoader']
    },
    moduleData() {
      return this.$store.getters['lms/moduleDetails'](this.moduleGuid)
    }
  }
}
</script>

<style scoped>
.activelink {
  text-decoration: none;
}
.disablelink {
  color: grey;
}
</style>
