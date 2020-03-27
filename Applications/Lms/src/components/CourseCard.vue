<template>
  <v-card class='mx-2 my-2' height='278px'>
    <div @click.stop="$emit('click')">
      <!-- Card header -->
      <v-layout v-bind:style="{'background-color': item.backgroundColor}">
        <v-flex ml-2 xs4 mt-2 mb-2>
          <v-img
            v-show="item.imageLink"
            v-bind:src='item.imageLink'
            height='80px'
            contain />
        </v-flex>
        <v-flex xs8>
          <v-card-title primary-title>
            <v-layout align-end justify-end column>
              <div :class='item.durationInfoClass' class="base-font-size font-weight-black">
                {{item.durationMinutesLabel}}
                </div>
              <div :class='item.modulesQtInfoClass' class="grey--text mt-1 base-font-size font-weight-normal">
                {{item.modulesQtLabel}}
              </div>
            </v-layout>
          </v-card-title>
        </v-flex>
      </v-layout>
      <!-- Card text -->
      <v-layout>
        <v-card-text class="px-6 py-2">
          <div class="px-4 text-hidden card-height">
            <h4 class='caption font-weight-medium color-grey05'>{{item.type}}</h4>
            <h3 class='cardTitle subheading font-weight-medium mb-1 blue--text text--darken-4'>
              {{item.name}}
            </h3>
            <div class='body-2 '>{{item.description}}</div>
          </div>
        </v-card-text>
      </v-layout>
    </div>
    <v-divider light></v-divider>
    <v-layout align-end justify-center row class='pa-2'>
      <v-icon
        id='favIcon'
        v-bind:color='item.isFavorite ? "red" : "grey"'
        @mouseenter='favIconColor = "red"'
        @mouseleave='favIconColor = "grey"'
        @click='changeFavoriteState(item)'
        >{{item.isFavorite === true ? 'favorite' : 'favorite_border'}}</v-icon>
      <v-spacer/>
      <v-chip small v-show="item.roles[0]" @click="roleSearch(item.roles[0])">{{item.roles[0] ? item.roles[0].name: null}}</v-chip>
      <v-chip small v-show="item.levels[0]" @click="levelSearch(item.levels[0])">{{item.levels[0] ? item.levels[0].name : null}}</v-chip>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: 'course-card',
  props: {
    item: Object
  }
}
</script>

<style>
.card-height {
  height: 118px;
}
.text-hidden {
  overflow: hidden;
  text-overflow: clip;
}
.color-grey05 {
  color:rgba(0,0,0,.5)
}
.base-font-size {
  font-size:14px;
}
.font-weight-black {
  font-weight:500;
}
.font-weight-normal {
  font-weight:400;
}
</style>
