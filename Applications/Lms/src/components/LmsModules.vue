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
    <Filters :filters="availableFilters" ></Filters>
		<v-layout wrap row>
			<!-- <v-flex mx-2 mt-4 mb-3>
				<h5 class='title font-weight-regular text-xs-left'>Модули</h5>
			</v-flex> -->
		</v-layout>
		<v-layout wrap row>
			<v-flex v-for='moduleData in modules' :key='moduleData.courseId' lg3 md4 sm6 xs12>

        <module-card v-if="moduleData" :moduleData="moduleData" />

			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>

export default {
  name: "lms-modules",
  created() {
    this.getModules()
  },
  methods: {
    getModules () {
      this.$store.dispatch('lms/getModules')
    },

    roleSearch: function(data) {
      this.$router.push({ name: "LMSMODULES", params: { role: data.code } });
    },
    levelSearch: function(data) {
      this.$router.push({ name: "LMSMODULES", params: { level: data.code } });
    }
  },
  computed: {
    availableFilters() {
      return this.$store.getters['lms/availableFilters']
    },

    modules () {
      return this.$store.getters['lms/modules']
    }
  }
}
</script>

<style scoped>

</style>
