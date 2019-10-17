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
    <Filters :filters="availableFilters" @filterChanged="refreshModulesFilter"></Filters>
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
import { checkFiltersChanges, separateFilters } from '../helpers/filters.js'

export default {
  name: "lms-modules",
  created() {
    if (this.$store.getters['lms/modules'] === null) {
      this.getModules()
    }
    if (this.$store.getters['lms/availableFilters'] === null) {
      this.getAvailableFilters()
    }
  },

  data() {
    return {
      filterChanged: false,
      allModules: [],
      modulesFiltered: []
    }
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
    },

    refreshModulesFilter: function(data) {
      var roles = []
      var levels = []
      var products = []
      var tags = []
      // проверить установленные фильтры
      const filters = data.currentFilters
      var setFilters = false
      if (filters) {
        for (let index = 0; index < filters.length; index++) {
          const filter = filters[index];
          for (let itemIndex = 0; itemIndex < filter.items.length; itemIndex++) {
            if (filter.items[itemIndex].selected) {
              setFilters = true
              break
            }
          }
          if (setFilters) {
            break
          }
        }
      }

      //var setFilters = checkFiltersChanges(filters)

      // Если фильтры не установлены
      if (!setFilters) {
        this.filterChanged = false
      } else {
        this.filterChanged = true
        this.modulesFiltered.length = 0
        // разделить фильтры по категориям
        for (let index = 0; index < filters.length; index++) {
          const filter = filters[index]
          switch (filter.name) {
            case 'Роль':
              for (let index = 0; index < filter.items.length; index++) {
                if (filter.items[index].selected) {
                  roles.push(filter.items[index])
                }
              }
              break
            case 'Уровень':
              for (let index = 0; index < filter.items.length; index++) {
                if (filter.items[index].selected) {
                  levels.push(filter.items[index])
                }
              }
              break
            case 'Продукт':
              for (let index = 0; index < filter.items.length; index++) {
                if (filter.items[index].selected) {
                  products.push(filter.items[index])
                }
              }
              break
            case 'Тэг':
              for (let index = 0; index < filter.items.length; index++) {
                if (filter.items[index].selected) {
                  tags.push(filter.items[index])
                }
              }
              break
          }
        }

        // var separatedFilters = separateFilters (filters)
        // roles = separatedFilters.roles
        // levels = separatedFilters.levels
        // products = separatedFilters.products
        // tags = separatedFilters.tags

        // Отфильтровать модули по выбранным фильтрам
        var selectedListId = []
        for (let index = 0; index < this.allModules.length; index++) {
          const moduleData = this.allModules[index];
          // roles
          for (let itemIndex = 0; itemIndex <  moduleData.roles.length; itemIndex++) {
            const role = moduleData.roles[itemIndex];
            for (let indexFilter = 0; indexFilter < roles.length; indexFilter++) {
              if (role.code === roles[indexFilter].code
                  && !selectedListId.includes(moduleData.moduleGuid)) {
                selectedListId.push(moduleData.moduleGuid)
                this.modulesFiltered.push(moduleData)
              }
            }
          }
          // levels
          for (let itemIndex = 0; itemIndex < moduleData.levels.length; itemIndex++) {
            const level = moduleData.levels[itemIndex]
            for (let indexFilter = 0; indexFilter < levels.length; indexFilter++) {
              if (level.code === levels[indexFilter]
                  && !selectedListId.includes(moduleData.moduleGuid)) {
                selectedListId.push(moduleData.moduleGuid)
                this.modulesFiltered.push(moduleData)
              }
            }
          }
          // products
          for (let index = 0; index < moduleData.products.length; index++) {
            const product = moduleData.products[index]
            for (let indexFilter = 0; indexFilter < products.length; indexFilter++) {
              if (product.code === products[indexFilter].code
                  && !selectedListId.includes(moduleData.moduleGuid)) {
                selectedListId.push(moduleData.moduleGuid)
                this.modulesFiltered.push(moduleData)
              }
            }
          }
          // tags
          for (let index = 0; index < moduleData.tags.length; index++) {
            const tag = moduleData.tags[index]
            for (let indexFilter = 0; indexFilter < tags.length; indexFilter++) {
              if (tag.code === tags[indexFilter].code &&
                  !selectedListId.includes(moduleData.moduleGuid)) {
                selectedListId.push(moduleData.moduleGuid)
                this.modulesFiltered.push(moduleData)
              }
            }
          }
        }
      }
    }
  },
  computed: {
    availableFilters() {
      var filters = this.$store.getters['lms/availableFilters']
      // добавить поле-признак выбора
      if (filters) {
        for (let index = 0; index < filters.length; index++) {
          var filter = filters[index];
          for (let itemIndex = 0; itemIndex < filter.items.length; itemIndex++) {
             filter.items[itemIndex].selected = false;
          }
        }
      }
      return filters
    },

    modules () {
      if (this.filterChanged) {
        return this.modulesFiltered
      } else {
        this.allModules = this.$store.getters['lms/modules']
        return this.allModules
      }
    }
  }
}
</script>

<style scoped>

</style>
