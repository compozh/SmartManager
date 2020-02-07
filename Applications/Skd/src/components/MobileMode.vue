<template>
    <v-layout wrap row class='user-container'>
        <v-flex class='align-flex' xs3>
            <user-photo :photo='user.photoProperty.photoUrl'></user-photo>
        </v-flex>
        <v-flex class='name-place-container align-flex' xs6>
            <v-flex>
						<!-- <v-flex>
							{{user.fullName}}
							<svg-key  v-if='user.hasKey'></svg-key>
						</v-flex>
						<v-flex>
							<div v-if="!user.DateTimeText.Today" class="user-date">
								<span class="user-date-date" v-if="!user.DateTimeText.Day">{{user.DateTimeText.Date}}</span>
								<span class="user-date-day">{{user.DateTimeText.Day}}</span>
							</div>
							<div :class='[user.IsGone ? "user-gone" : "", user.IsAbsend ? "user-absend
                            " : "","user-time"]'>
								<span>{{user.DateTimeText.Time }}</span>
								<span :class='user.IsAbsend ? "" : "placename"'>{{user.placeName}}</span> 
							</div>
						</v-flex>-->

                        <v-flex>
                            <span>{{user.fullName}}</span>
                            <svg-key v-if='user.hasKey'></svg-key>
                        </v-flex>
                        <v-flex>
                            <div v-if="user.IsAbsend" class="user-absend">
                                <span>{{user.placeName}}</span>
                            </div>
                            <div v-else :class='user.IsGone ? "user-gone" : "user-time"'>
                                <div class="user-date-day">
                                    <span v-if='!user.DateTimeText.Today' >{{user.DateTimeText.Day}}</span>
                                </div>
                                <div>
                                    <span>{{user.DateTimeText.Time }}</span>
                                    <span class="placename">{{user.placeName}}</span>
                                </div>   
                            </div>
                        </v-flex>
					</v-flex>
        </v-flex>
        <v-flex class='align-flex' xs3>
            <v-flex>
                <v-flex>
                    {{user.department}}
                </v-flex>
            </v-flex>
        </v-flex>
        <v-flex v-on:click='openMoreInformation =! openMoreInformation' class='container-information-arrow' xs1>
                <i v-if='!openMoreInformation' class='material-icons information-arraw'>
                    keyboard_arrow_down
                </i>
                <i v-if='openMoreInformation' class='material-icons information-arraw'>
                    keyboard_arrow_up
                </i>
        </v-flex>
        <v-layout v-if="openMoreInformation" wrap>
            <v-flex>
                <v-flex>
                    <v-flex v-if='user.email' class='text-svg-container'>
                        <svg-email></svg-email> 
                        <a :href='"mailto:" + user.email'><span class='text-container'>{{user.email}}</span></a>
                    </v-flex>
                    <v-flex v-if='user.mobileTel' class='text-svg-container'>
                        <svg-mobile-phone></svg-mobile-phone>
                        <a class="text-information" :href="'tel:'+user.mobileTel"><span class='text-container'>{{user.mobileTel}}</span></a>
                    </v-flex>
                    <v-flex v-if='user.workTel' class='text-svg-container'>
                        <svg-office-phone></svg-office-phone> <span class='text-container'>{{user.workTel}}</span>
                    </v-flex>
                </v-flex>
            </v-flex>
            <v-flex>
                <v-flex>
                    <v-flex v-if='user.skype' class='text-svg-container'>
                        <svg-skype></svg-skype> <span class='text-container'>{{user.skype}}</span>
                    </v-flex>
                    <v-flex v-if='user.birthday' class='text-svg-container'>
                        <svg-birthday></svg-birthday> <span class='text-container'>{{user.birthday}}</span>
                    </v-flex>
                </v-flex>
            </v-flex>
        </v-layout>
    </v-layout>
</template>

<script>
import userPhoto from './UserPhoto'
import svgKey from '../svg/svgKey'
import svgSkype from '../svg/svgSkype'
import svgBirthday from '../svg/svgBirthday'
import svgOfficePhone from '../svg/svgOfficePhone'
import svgEmail from '../svg/svgEmail'
import svgMobilePhone from '../svg/svgMobilePhone'
export default {
  components: {
    'user-photo': userPhoto,
    'svg-key': svgKey,
    'svg-skype': svgSkype,
    'svg-birthday': svgBirthday,
    'svg-office-phone': svgOfficePhone,
    'svg-email': svgEmail,
    'svg-mobile-phone': svgMobilePhone
  },
  data() {
    return {
      openMoreInformation: false
    }
  },
  created() {
    console.log(this.user)
  },
  props: ['user']
}
</script>

<style scoped>
.align-flex {
	flex-basis: 0;
	flex-grow: 0.5;
}
.container-information-arrow{
    text-align: right;
}
.user-container{
    box-shadow: 0 1px 1px -1px rgba(0,0,0,.02),0 2px 2px 0 rgba(0,0,0,.05),0 1px 1px 0 rgba(0,0,0,.05)!important;
    margin-bottom: 5px;
    margin-top: 5px;
}
.text-svg-container{
    padding-left: 5px;
    display: flex;
    align-items: center;
}
.container {
    padding: 0px !important;
}
.text-container{
    padding-left: 3px;
}
.key-style{
    padding-left: 3px;
}
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
</style>
