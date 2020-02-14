<template>
    <v-layout wrap class='user-container'>
				<v-flex lg1 class='align-flex'>
					<user-photo class="desktop-photo-container" :photo='user.photoProperty.photoUrl'></user-photo>
				</v-flex>
				<v-flex class='name-place-container align-flex'>
					<v-flex>
						<v-flex>
							{{user.fullName}}
							<svg-key  v-if='user.hasKey'></svg-key>
						</v-flex>
						<v-flex>
							<div v-if="!user.DateTimeText.Today" class="user-date">
								<span class="user-date-date" v-if="!user.DateTimeText.Day">{{user.DateTimeText.Date}}</span>
								<span class="user-date-day">{{user.DateTimeText.Day}}</span>
							</div>
							<div :class='[user.IsGone ? "user-gone" : "", user.IsAbsend ? "user-absent" : "","user-time"]'>
								<span>{{user.DateTimeText.Time }}</span>
								<span :class='user.IsAbsend ? "" : "placename"'>{{user.placeName}}</span> 
							</div>
						</v-flex>
					</v-flex>
				</v-flex>
				<v-flex class='align-flex'>
					<v-flex>
						<v-flex v-if='user.email' class='text-svg-container'>
							<svg-email></svg-email> 
							<a :href='"mailto:" + user.email'><span class='text-container'>{{user.email}}</span></a>
						</v-flex>
						<v-flex v-if='user.mobileTel' class='text-svg-container'>
							<svg-mobile-phone></svg-mobile-phone>
							<a class="text-information" :href="'tel:'+user.mobileTel"><span class='text-container'>{{user.mobileTel}}</span></a>
						</v-flex>
					</v-flex>
				</v-flex>
				<v-flex class='align-flex' lg2>
					<v-flex>
						<v-flex v-if='user.skype' class='text-svg-container'>
							<svg-skype></svg-skype>
							<a class="text-information" :href="'skype:'+user.skype+'?call'">
							<span class='text-container'>{{user.skype}}</span>
							</a>
						</v-flex>
						<v-flex  v-if='user.workTel' class='text-svg-container'>
							<svg-office-phone></svg-office-phone>
							<span class='text-container'>{{user.workTel}}</span>
						</v-flex>
					</v-flex>
				</v-flex>
				<v-flex class='align-flex' lg2>
					<v-flex>
						<v-flex v-if='user.birthday' class='text-svg-container'>
							<svg-birthday></svg-birthday>
							<span class='text-container'>{{user.birthday}}</span>
						</v-flex>
					</v-flex>
				</v-flex>
				<v-flex class='align-flex departament-section' lg1>
					<v-flex>
						<v-flex v-if='user.department'>
							<span class='text-container'>{{user.department}}</span>
						</v-flex>
					</v-flex>
				</v-flex>
			</v-layout>
</template>

<script>
import userPhoto from "../UserPhoto";
import svgKey from "../../svg/svgKey";
import svgSkype from "../../svg/svgSkype";
import svgBirthday from "../../svg/svgBirthday";
import svgOfficePhone from "../../svg/svgOfficePhone";
import svgEmail from "../../svg/svgEmail";
import svgMobilePhone from "../../svg/svgMobilePhone";

export default {
  components: {
    'user-photo': userPhoto,
    'svg-key': svgKey,
    'svg-skype': svgSkype,
    'svg-birthday': svgBirthday,
    'svg-office-phone': svgOfficePhone,
    'svg-email': svgEmail,
    'svg-mobile-phone': svgMobilePhone,
  } ,  
  props: ['user']
}
</script>
<style lang='scss' scoped>
.align-flex {
	flex-basis: 0;
	flex-grow: 0.5;
}
.departament-section {
	text-align: right;
	padding-right: 10px;
}
.text-svg-container{
    padding-left: 5px;
    display: flex;
    align-items: center;
}
.text-container{
	padding-left: 5px;
}
.name-place-container {
	padding-left: 20px;
}
.user-container {
    width: 100%;
    margin: 10px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)!important;
}
.text-svg-container{
	padding-left: 5px;
}
.user-gone {
  color: red;
}
.user-absent {
  opacity: 0.5;
}
.placename {
	padding-left: 10px;
    font-weight: 400;
}
.user-date-date {
  font-size: 0.9em;
}
.user-date-day {
  color: #999;
  font-size: 0.9em;
}
.desktop-photo-container {
    margin: 10px;
    height: 80px;
    width: 80px;
}
</style>