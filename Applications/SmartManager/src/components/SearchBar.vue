<template>
  <div class="flex justify-between border border-solid d-theme-border-grey-light border-r-0
               border-t-0 border-l-0 items-center app-search-container">
    <vs-input icon="icon-search"
              size="large"
              icon-pack="feather"
              :placeholder="$t('search')"
              v-model.trim="search"
              class="vs-input-no-border flex-1 vs-input-no-shdow-focus no-icon-border"/>
    <vs-button v-if="$route.name === 'task-list' && search"
               @click="globalSearch"
               class="mr-3"
               size="small"
               color="primary"
               type="border"
               icon-pack="feather"
               icon="icon-search">{{ $t('buttons.globalSearch') }}
    </vs-button>
  </div>
</template>

<script>
export default {
  name: 'search-bar',
  computed: {
    search: {
      get() {
        return this.$store.state.sm.search
      },
      set(search) {
        this.$emit('search')
        this.$store.commit('sm/setSearch', search)
      }
    }
  },
  methods: {
    async globalSearch() {
      await this.$store.dispatch('sm/globalSearch')
      if (this.$route.path !== '/tasks/search') {
        await this.$router.push('/tasks/search')
      }
    }
  }
}
</script>

<style scoped>
  .btn-global-search {

  }
</style>
