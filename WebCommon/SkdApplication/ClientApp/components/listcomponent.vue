<template>

	<v-flex class="rowusers"  row wrap>
		<v-card class="user-card" style="width: 100%">

				<v-flex class="photo" style="flex-basis: 100px; max-width: 100px">
					<photo-component :photo='userCopmonent.photo'></photo-component>
				</v-flex>

				<v-flex class="commoninformation" xl3>
					<v-flex xl12>{{userCopmonent.P_FIO}}</v-flex>
					<v-flex xl12>{{userCopmonent.R_DT}}</v-flex>
					<v-flex sl12>{{userCopmonent.PLACENAME}}</v-flex>
				</v-flex>

				<v-flex class="contactiformation" xl3>
					<v-flex xl12>{{userCopmonent.EMAIL}}</v-flex>
					<v-flex xl12>{{userCopmonent.TEL}}</v-flex>
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

</style>
