  <template>
    <v-container pa-0>
      <v-layout>
          <v-flex xs12>
            <!-- Панель фильтров -->
            <v-toolbar dense flat v-if="filters">
              <v-label class="mr-0">
								Фильтр:
						</v-label>

						<v-divider class="mx-2" vertical></v-divider>
						<!-- Кнопки фильтров -->
						<v-btn-toggle max
									v-model="currentFilterIndex"
									class="transparent">
							<!-- Если нет доступного фильтра - скрыть кнопку -->
							<v-layout v-for="(filter, index) in filters" :key="index">
								<v-btn
                      v-if="filter.items.length > 0"
											:value="index"
											@click="setFilter(index)"
											flat
											class="mx-2">
										{{filter.name}}
									<v-icon>{{index === currentFilterIndex ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</v-icon>
								</v-btn>
							</v-layout>
						</v-btn-toggle>
						<v-divider
							class="mx-2"
							vertical>
						</v-divider>

							<!-- скрыть кнопку пока не нажата одна из кнопок фильтров -->
						<div v-if="filterButtonPressed">
							<v-btn flat
										@click.stop="applyFilter">Применить</v-btn>
						</div>
					</v-toolbar>

						<div v-if="filterButtonPressed">
							<v-card>
								<v-card-title class="pl-5 pt-3">
									<div class="headline">{{filters[currentFilterIndex].name}}</div>
								</v-card-title>
								<!-- Список элементов фильтра -->
								<v-list>
									<v-list-tile v-for="(item, index) in filters[currentFilterIndex].items" :key="index"
															style="height:30px">
										<v-list-tile-action>
											<v-checkbox v-model="item.selected" :label="item.name"></v-checkbox>
										</v-list-tile-action>
									</v-list-tile>
								</v-list>
								<v-divider class="ma-2">
								</v-divider>
								<!-- кнопка очистки -->
								<v-card-actions>
									<v-btn flat
												color="blue"
												@click.stop="clearFilter">Очистить</v-btn>
								</v-card-actions>
							</v-card>
						</div>
				</v-flex>
			</v-layout>
	</v-container>
</template>

<script>
export default {
  name: 'Filters',
  props: {
    filters: Array
  },
  data() {
    return {
			// текущий активный фильтр
			currentFilterIndex: - 1,
			filterButtonPressed: false,
			currentFilters: [],
			filtersLoaded: false
		}
	},
	methods: {
		applyFilter() {
			this.currentFilterIndex = -1
			this.filterButtonPressed = false
			// Применить фильтр к текущим модулям/курсам - передать текущий фильтр родителю
			this.$emit('filterChanged', { currentFilters: this.currentFilters })
		},
		setFilter(index) {
			// загрузить данные из props в локльную переменную. однократно
			if (!this.filtersLoaded) {
				for (let index = 0; index < this.filters.length; index++) {
					this.currentFilters.push(this.filters[index])
				}
				this.filtersLoaded = true
			}
			if (this.currentFilterIndex === index) {
				this.filterButtonPressed = !this.filterButtonPressed
			} else {
				this.filterButtonPressed = true
			}
		},
		clearFilter() {
      // сбросить выбор
			for (let index = 0; index < this.currentFilters[this.currentFilterIndex].items.length; index++) {
				this.currentFilters[this.currentFilterIndex].items[index].selected = false
			}
		}
	},
	computed: {
		// индекс текущего активного фильтра
		currentFilterIndex() {
				return this.currentFilterIndex !== -1 ? this.currentFilterIndex - 1 : 0
			}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
