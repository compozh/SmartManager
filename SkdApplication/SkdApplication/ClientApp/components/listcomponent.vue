<template>

	<v-flex class="rowusers" :class="{'ma-0':$vuetify.breakpoint.mdAndDown}" row wrap>
		<v-card class="user-card" style="width: 100%">

				<v-flex :class="[$vuetify.breakpoint.mdAndDown ? 'md-photo':'photo' ]">
					<photo-component :photo='userCopmonent.photo'></photo-component>
				</v-flex>

				<v-flex class="commoninformation">
					<v-flex class="container-fio-key"><h4>{{userCopmonent.P_FIO}}</h4>
						<div class="container-key" v-if="userCopmonent.HASKEY == '+'">
							<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="key" class="svg-inline--fa fa-key fa-w-16 with-key" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z"></path></svg>
						</div>
					</v-flex>
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
	.user-date-date{
		font-size: 0.9em;
	}
	.user-date{
		line-height: 1;
	}
	.container-fio-key{
		display: flex;
	}
	.container-key{
		height: 20px;
	}
	.with-key{
		color:#FF9800;
		width: 18px;
		height: 18px;
	}
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
