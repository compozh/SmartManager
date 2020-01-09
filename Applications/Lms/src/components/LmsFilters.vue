  <template>
    <v-container fluid pa-0>
      <v-layout justify-center>
        <v-flex
          class="hidden-xs-only"
          xl5 lg5 md6 sm8 xs12>
          <!-- Панель фильтров на тулбаре -->
          <v-toolbar
            v-if="filters"
            dense
            flat
            class="hidden-xs-only">
            <v-label class="mr-0">
				  		Фильтр:
				    </v-label>

						<v-divider class="mx-2" vertical></v-divider>
						<!-- Кнопки фильтров -->
						<v-btn-toggle max
									v-model="currentFilterIndex"
									class="transparent">
							<!-- Если нет доступного фильтра - скрыть кнопку -->
							<v-layout v-for="(filter, index) in currentFilters" :key="index">
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
					</v-toolbar>

					<div v-if="filterButtonPressed">
						<v-card>
							<v-card-title class="pl-5 pt-3">
								<div class="headline">{{filters[currentFilterIndex].name}}</div>
							</v-card-title>
							<!-- Список элементов фильтра -->
							<v-list>
								<v-list-tile v-for="(item, index) in currentFilters[currentFilterIndex].items" :key="index"
														style="height:30px">
									<v-list-tile-action>
										<v-checkbox v-model="item.selected" :label="item.name"></v-checkbox>
									</v-list-tile-action>
								</v-list-tile>
							</v-list>
							<v-divider class="ma-2">
							</v-divider>
              <!-- Кнопки -->
							<v-card-actions>
                <v-layout row justify-space-between>
                  <v-flex shrink>
                    <v-btn flat
											color="blue"
											@click.stop="clearFilter">Очистить</v-btn>
                  </v-flex>
                  <v-flex shrink>
                    <v-btn
                      flat
									    @click.stop="applyFilter">Применить</v-btn>
                  </v-flex>
                </v-layout>
							</v-card-actions>
						</v-card>
					</div>
				</v-flex>

        <!-- Панель фильтров на списке -->
        <v-flex
          class="hidden-sm-and-up"
          xs12>
          <v-card flat transparen>
			    		<v-card-title>
                <v-label class="mr-2">
                  Фильтр:
                </v-label>
			    		</v-card-title>
            <v-list>
              <v-list-group
                v-for="(item, index) in filters"
                :key="index"
			    			 v-if="item.items.length > 0"
                v-model="item.active"
                @click="setCurrentFilterIndex(index)"
                no-action
              >
                <template v-slot:activator>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>

                <v-list-tile
                  v-for="subItem in item.items"
                  :key="subItem.name">
                  <v-checkbox v-model="subItem.selected" :label="subItem.name">{{ subItem.name }}</v-checkbox>
                </v-list-tile>
              </v-list-group>
            </v-list>
			    	<v-divider
                class="mx-2"
                horisontal>
            </v-divider>
            <v-card-actions>
              <v-layout row >
                <v-flex shrink>
                  <v-btn flat
										color="blue"
										@click.stop="clearFilter">Очистить</v-btn>
                </v-flex>
                <v-flex shrink>
                  <v-btn
                    flat
								    @click.stop="applyFilter">Применить</v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>

          </v-card>
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
  created() {
		// загрузить данные из props в локльную переменную. однократно
		for (let index = 0; index < this.filters.length; index++) {
			this.currentFilters.push(this.filters[index])
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
    },
    setCurrentFilterIndex(index) {
      this.currentFilterIndex = index
    }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
