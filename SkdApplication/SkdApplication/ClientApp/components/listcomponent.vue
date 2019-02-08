<template>

	<v-flex class="rowusers"  row wrap>
		<v-card class="user-card" style="width: 100%">

				<v-flex class="photo" style="flex-basis: 100px; max-width: 100px">
					<photo-component :photo='userCopmonent.photo'></photo-component>
				</v-flex>

				<v-flex class="commoninformation" xl3>
					<v-flex xl12><h4>{{userCopmonent.P_FIO}}</h4></v-flex>
					<v-flex xl12>
						<div v-if="!userCopmonent.DateTimeText" class="user-date">
							<span class="user-date-date">{{userCopmonent.DateTimeText.Date}}</span>
							<span class="user-date-day">{{userCopmonent.DateTimeText.Day}}</span>

						</div>
						<div class="user-time">
							<span>{{userCopmonent.DateTimeText.Time}}</span>
							<span class="placename">{{userCopmonent.PLACENAME}}</span>
						</div>

					</v-flex>
				</v-flex>

				<v-flex class="contactiformation" xl3>
					<v-flex xl12><a :href="'mailto:'+userCopmonent.EMAIL"> {{userCopmonent.EMAIL}}</a></v-flex>
					<v-flex xl12><a :href="'callto:'+userCopmonent.TEL">{{userCopmonent.TEL}}</a> </v-flex>
					<v-flex xl12>{{userCopmonent.TEL2}}</v-flex>
				</v-flex>

				<v-flex class="contactiformation" xl3>
					<v-flex xl12>{{userCopmonent.BIRTHDAY}}</v-flex>
					<v-flex xl12>{{userCopmonent.SKYPE}}</v-flex>
				</v-flex>
				<v-flex class="departament" x1>{{userCopmonent.DEPARTMENT}}</v-flex>

		</v-card>

	</v-flex>

</template>

<script>
	import vuetify from "vuetify"
	import PhotoComponent from "./photocomponent"
	// component on photo можно передать  user.photo а в компоненте на фотоо будет выводиться фото
	export default {
		props: ['userCopmonent'], //указываю свойсвто  users_list для считывания списка изверов
		components: {
			'photo-component': PhotoComponent // объявляю пользовательский компонент
		},
	}
</script>

<style scoped lang="scss">
	.rowusers{
		margin:10px;
	}
	.user-card{
		display: flex;
		flex-direction: row;
	}
	.user-date-day {
		color: #999;
		font-size: 0.9em;
	}
	.placename{
		font-weight: bold;

	}

</style>
