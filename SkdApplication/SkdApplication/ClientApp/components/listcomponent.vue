<template>

	<v-flex class="rowusers" :class="{'ma-0':$vuetify.breakpoint.mdAndDown}" row wrap>
		<v-card class="user-card" style="width: 100%">

				<v-flex :class="[$vuetify.breakpoint.mdAndDown ? 'md-photo':'photo' ]">
					<photo-component :photo='userCopmonent.photo'></photo-component>
				</v-flex>

				<v-flex class="commoninformation">
					<v-flex ><h4>{{userCopmonent.P_FIO}}</h4></v-flex>
					<v-flex >
						<div v-if="!userCopmonent.DateTimeText.Today" class="user-date">
							<span class="user-date-date">{{userCopmonent.DateTimeText.Date}}</span>
							<span class="user-date-day">{{userCopmonent.DateTimeText.Day}}</span>

						</div>
						<div :class="[userCopmonent.IsGone ? 'user-gone' : '', userCopmonent.IsAbsend?'user-absent':'', 'user-time']">
							<span>{{userCopmonent.DateTimeText.Time}}</span>
							<span class="placename">{{userCopmonent.PLACENAME}}</span>
						</div>

					</v-flex>
				</v-flex>

				<v-flex  class="contactiformation hidden-md-and-down">
					<v-flex ><a :href="'mailto:'+userCopmonent.EMAIL"> {{userCopmonent.EMAIL}}</a></v-flex>
					<v-flex ><a :href="'callto:'+userCopmonent.TEL">{{userCopmonent.TEL}}</a> </v-flex>
					<v-flex >{{userCopmonent.TEL2}}</v-flex>
				</v-flex>

				<v-flex class="contactiformation hidden-md-and-down" >
					<v-flex >{{userCopmonent.BIRTHDAY}}</v-flex>
					<v-flex >{{userCopmonent.SKYPE}}</v-flex>
				</v-flex>
				<v-flex class="departament" >{{userCopmonent.DEPARTMENT}}</v-flex>

		</v-card>

	</v-flex>

</template>

<script>
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
	.md-photo{
		flex-basis: 60px; max-width: 60px
	}
	.photo{
		flex-basis: 100px; max-width: 100px
	}
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
		font-weight: 500;

	}
	.user-gone{
		color:red;
	}
	.user-absent{
		opacity: 0.5;
		.placename{
			font-weight: 400;
		}
	}
	.departament{
		text-align: right;
	}

</style>
