<template>
  <v-layout v-on:click="expanded =! expanded" class="user-container">
    <v-flex v-if="!expanded">
      <user-card :user="user"></user-card>
    </v-flex>
    <v-flex v-else>
      <user-card-expanded :user="user"></user-card-expanded>
    </v-flex>

    <!-- <v-flex class="user-photo" xs2>
      <user-photo class="mobile-photo-container" :photo="user.photoProperty.photoUrl"></user-photo>
    </v-flex>
    <v-flex class="user-info" xs7>
      <v-flex>
        <v-flex>
          <span>{{user.fullName}}</span>
        </v-flex>
        <v-flex>
          <div v-if="user.IsAbsend" class="user-absend">
            <span>{{user.placeName}}</span>
          </div>
          <div v-else :class='user.IsGone ? "user-gone" : "user-time"'>
            <div class="user-date-day">
              <span v-if="!user.DateTimeText.Today">{{user.DateTimeText.Day}}</span>
            </div>
            <div>
              <span>{{user.DateTimeText.Time }}</span>
              <span class="placename">{{user.placeName}}</span>
            </div>
          </div>
        </v-flex>
      </v-flex>
    </v-flex>
    <v-flex class="user-department" xs3>
      <span>{{user.department}}</span>
    </v-flex> -->
    <!-- <v-layout v-if="expanded" wrap>
      <v-flex>
        <v-flex>
          <v-flex v-if="user.email" class="text-svg-container">
            <svg-email></svg-email>
            <a href='mailto:" + user.email'>
              <span class="text-container">{{user.email}}</span>
            </a>
          </v-flex>
          <v-flex v-if="user.mobileTel" class="text-svg-container">
            <svg-mobile-phone></svg-mobile-phone>
            <a class="text-information" :href="'tel:'+user.mobileTel">
              <span class="text-container">{{user.mobileTel}}</span>
            </a>
          </v-flex>
          <v-flex v-if="user.workTel" class="text-svg-container">
            <svg-office-phone></svg-office-phone>
            <span class="text-container">{{user.workTel}}</span>
          </v-flex>
        </v-flex>
      </v-flex>
      <v-flex>
        <v-flex>
          <v-flex v-if="user.skype" class="text-svg-container">
            <svg-skype></svg-skype>
            <span class="text-container">{{user.skype}}</span>
          </v-flex>
          <v-flex v-if="user.birthday" class="text-svg-container">
            <svg-birthday></svg-birthday>
            <span class="text-container">{{user.birthday}}</span>
          </v-flex>
        </v-flex>
      </v-flex>
    </v-layout> -->
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
      openMoreInformation: false,
      expanded: false
    };
  },
  created() {
    //console.log(this.user);
  },
  props: ["user"]
};
</script>

<style lang='scss' scoped>
.container-information-arrow {
  text-align: right;
}
.user-container {
  box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.02),
    0 2px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 1px 0 rgba(0, 0, 0, 0.05) !important;
  margin-bottom: 5px;
  margin-top: 5px;
}
.text-svg-container {
  padding-bottom: 3px;
  padding-top: 5px;
  padding-left: 10px;

  font-size: 1em;
  display: flex;
  align-items: center;
}
.container {
  padding: 0px !important;
}
.text-container {
  padding-left: 3px;
}
.key-style {
  padding-left: 3px;
}
.mobile-photo-container-expanded {
  margin: 5px;
  height: 80px;
  width: 80px;
}
</style>
