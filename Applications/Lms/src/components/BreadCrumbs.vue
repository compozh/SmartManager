<template>
  <v-container pa-0 ma-0>
    <v-card v-if="links" class="px-2 py-2">
      <ul>
        <li v-for="(link, index) in links" :key="index"
          class="horisontal-list px-1"
          :class="{'active-link': index < links.length - 1, passive: index === links.length -1}"
          @click.stop="goToLink(index)">
          {{link.title}} <span class="pl-1 grey--text" v-if="index < links.length - 1">></span>
        </li>
      </ul>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'bread-crumbs',
  props: {
    links: Array
  },
  methods: {
    goToLink(index) {
      if (index === this.links.length - 1) {
        return
      }
      this.$emit('linkChoiced', index)
    }
  }
}
</script>

<style scoped>
.horisontal-list {
  list-style-type: none;
  margin-left: 0;
  padding-left: 0;
  display: inline-block;
}
.active-link {
  color:blue;
  cursor: pointer;
}
.passive {
  color: grey;
  cursor: default;
}
</style>
