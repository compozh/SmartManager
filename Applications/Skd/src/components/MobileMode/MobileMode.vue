<template>
  <v-layout v-on:click="setUserCard" class="user-container">
    <v-flex v-if="!expanded">
      <user-card :user="user"></user-card>
    </v-flex>
    <v-flex v-else>
      <user-card-expanded :user="user"></user-card-expanded>
    </v-flex>
  </v-layout>
</template>

<script>
import userCard from "./UserCard";
import userCardExpanded from "./UserCardExpanded";

export default {
  components: {
    "user-card": userCard,
    "user-card-expanded": userCardExpanded
  },
  data() {
    return {
      expanded: false
    };
  },
  computed: {
    userDataItemSelected: {
      get() { 
        return this.$store.getters['skd/getUserDataItemSelected'] 
      },
      set(value) {
        this.$store.commit('skd/setUserDataItemSelected', value)
      } 
    }
  },
  methods: {
    setUserCard() {
      if (this.userDataItemSelected) {
        this.userDataItemSelected = !this.userDataItemSelected
        return
      }
      this.expanded =! this.expanded
    }
  },
  props: ["user"]
};
</script>

<style lang='scss' scoped>
.user-container {
  box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.02),
    0 2px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 1px 0 rgba(0, 0, 0, 0.05) !important;
  margin-bottom: 5px;
  margin-top: 5px;
}
</style>
