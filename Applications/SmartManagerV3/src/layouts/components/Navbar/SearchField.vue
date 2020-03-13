<template>
  <v-text-field
    v-model.lazy="search"
    dense
    clearable
    single-line
    hide-details
    :style="style"
    @focus="focused"
    @blur="blurred"
    class="body-2">
    <template #label>
      <span class="body-2">{{ $t('search') }}</span>
    </template>
    <template #append-outer>
      <v-icon small style="margin-top: 5px">fas fa-search</v-icon>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'SearchField',
  data: () => ({
    hidden: false,
    style: {
      maxWidth: '200px',
      transition: 'max-width 0.3s'
    }
  }),
  computed: {
    search: {
      get () {
        return this.$store.state.search
      },
      set (search) {
        this.$store.commit('SET_SEARCH', search)
      }
    }
  },
  methods: {
    focused () {
      this.style.maxWidth = '600px'
    },
    blurred () {
      this.style.maxWidth = '200px'
    },
    async globalSearch () {
      await this.$store.dispatch('globalSearch')
      if (this.$route.path !== '/tasks/search') {
        await this.$router.push('/tasks/search')
      }
    }
  }
}
</script>

<style scoped>

</style>
