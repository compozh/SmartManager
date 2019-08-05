<template>
	<v-container fluid px-0 my-4>
		<v-layout>
			<v-flex xs12>
				<v-card v-bind:style="{'background-color': '#1a237e'}">
					<v-flex py-3>
						<h4 class='pt-3 pb-2 headline font-weight-medium text-xs-center white--text text--darken-3'>Ознакомьтесь с рекомендуемыми модулями</h4>
						<h5 class='mx-3 subheading font-weight-regular text-xs-center grey--text text--lighten-3'>Модули - короткие самостоятельные учебные пособия, которые охватывают отдельные темы и задачи</h5>
					</v-flex>
					<v-flex py-2>
						<v-divider />
					</v-flex>
					<!-- <v-layout py-3 row px-2>
						<v-spacer/>
						<v-layout column v-if="roles.length > 0">
							<h5 class='mx-2 body-2 font-weight-medium text-xs-left grey--text text--lighten-3'>Ваша роль</h5>
							<v-flex v-for='role in roles' v-bind:key="role.code" >
								<v-chip v-bind:outline="!role.selected" small @click="roleSearch(role)">{{role.name}}</v-chip>
							</v-flex>
						</v-layout>
						<v-layout column v-if="levels.length > 0">
							<h5 class='mx-2 body-2 font-weight-medium text-xs-left grey--text text--lighten-3'>Ваш уровень</h5>
							<v-flex v-for='level in levels' v-bind:key="level.code" >
								<v-chip v-bind:outline="!level.selected" small @click="levelSearch(level)">{{level.name}}</v-chip>
							</v-flex>
						</v-layout>
						<v-layout column v-if="products.length > 0">
							<h5 class='mx-2 body-2 font-weight-medium text-xs-left grey--text text--lighten-3'>Продукты</h5>
							<v-flex v-for='product in products' v-bind:key="product.code" >
								<v-chip v-bind:outline="!product.selected" small @click="productSearch(product)">{{product.name}}</v-chip>
							</v-flex>
						</v-layout>
						<v-layout column v-if="tags.length > 0">
							<h5 class='mx-2 body-2 font-weight-medium text-xs-left grey--text text--lighten-3'>Теги</h5>
							<v-flex v-for='tag in tags' v-bind:key="tag.code" >
								<v-chip v-bind:outline="!tag.selected" small @click="tagSearch(tag)">{{tag.name}}</v-chip>
							</v-flex>
						</v-layout>
					</v-layout> -->
				</v-card>
			</v-flex>
		</v-layout>
    <!-- Filters -->
    <Filters :filters="filtersData" ></Filters>
		<v-layout wrap row>
			<v-flex mx-2 mt-4 mb-3>
				<h5 class='title font-weight-regular text-xs-left'>Модули</h5>
			</v-flex>
		</v-layout>
		<v-layout wrap row>
			<v-flex v-for='moduleData in modules' :key='moduleData.courseId' lg3 md4 sm6 xs12>
				<v-card class='mx-2 my-2' hover height='255px'>
					<v-layout>
						<v-flex xs4 mt-2 mb-2>
							<v-img
								v-show="moduleData.imageLink"
								v-bind:src='moduleData.imageLink'
								height='80px'
								contain/>
						</v-flex>
						<v-flex xs8>
							<v-card-title primary-title>
								<v-layout align-end justify-start column>
									<div style='font-size:14px;font-weight:500'>{{moduleData.durationMinutesLabel}}</div>
									<div class='grey--text mt-1' style='font-size:14px;font-weight:400'>{{moduleData.lessonsQtLabel}}</div>
								</v-layout>
							</v-card-title>
						</v-flex>
					</v-layout>
					<div style='height:118px;overflow:hidden' class='mt-0 ml-3'>
						<h4 class='caption font-weight-medium' style='color:rgba(0,0,0,.5)'>{{moduleData.type}}</h4>
						<h3 class='cardTitle subheading font-weight-medium mb-1 blue--text text--darken-4'
							@click='$router.push({name: "LMSMODULEDETAILS", params: {moduleGuid: moduleData.moduleGuid, moduleName: moduleData.name, moduleData: moduleData}})'>{{moduleData.name}}
						</h3>
						<div class='.body-2'>{{moduleData.description}}</div>
					</div>
					<v-divider light></v-divider>
					<v-layout align-end justify-center row>
						<v-icon
							id='favIcon'
							v-bind:color='moduleData.isFavorite ? "red" : "grey"'
							@mouseenter='favIconColor = "red"'
							@mouseleave='favIconColor = "grey"'
							@click='moduleData.isFavorite = !moduleData.isFavorite'
							>{{moduleData.isFavorite === true ? 'favorite' : 'favorite_border'}}</v-icon>
						<v-spacer/>
						<v-chip small v-show="moduleData.roles[0]" @click="cardsRoleSearch(moduleData.roles[0])">{{moduleData.roles[0] ? moduleData.roles[0].name: null}}</v-chip>
						<v-chip small v-show="moduleData.levels[0]" @click="cardsLevelSearch(moduleData.levels[0])">{{moduleData.levels[0] ? moduleData.levels[0].name : null}}</v-chip>
					</v-layout>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>

export default {
  name: "lms-modules",
  props: ["modules"],
  data() {
    return {
      filtersData: [
        {
          name: 'Роль',
          items: [{code: 'А', name: 'Администратор', selected: false}]
        },
        {
          name: 'Уровень',
          items: [{code: 'B', name: 'Начальный', selected: false}]
        },
        {
          name: 'Продукт',
          items: [{code: 'BUH', name: 'Бухгалтерия', selected: false}]
        },
        {
          name: 'Тэг',
          items: []
        }
      ]
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
