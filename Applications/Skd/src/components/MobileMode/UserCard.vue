<template>
  <v-layout>
    <v-flex class="user-photo" xs2>
      <svg-key class="user-key" v-if="user.hasKey"></svg-key>
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
    </v-flex>
  </v-layout>
</template>

<script>
import userPhoto from "../UserPhoto";
import svgKey from "../../svg/svgKey";
export default {
  name: "user-card",
  components: {
    "user-photo": userPhoto,
    "svg-key" : svgKey
  },
  data: () => ({}),
  props: ["user"]
};
</script>

<style lang='scss' scoped>
.user-gone {
  color: red;
}
.user-absend {
  opacity: 0.5;
  font-size: 0.9em;
}
.placename {
  padding-left: 10px;
  font-weight: 400;
}
.user-date-date {
  font-size: 0.9em;
}
.user-date-day {
  padding-right: 8px;
  color: #999;
  font-size: 0.9em;
}
.user-info {
  padding-left: 10px;
}
.user-department {
  text-align: right;
  font-size: 0.9em;
  color: #999;
  padding-right: 1em;
}
.user-key {
  left: 0px;
  top: 0px;
  position: absolute;
  z-index: 1;
  transform: rotate(-45deg);
}
.mobile-photo-container {
  margin: 3px;
  height: 50px;
  width: 50px;
  z-index: 3;
}
.user-photo {
  position: relative;
}
</style>
