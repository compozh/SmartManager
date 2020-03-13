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

    <template #append>
      <v-btn x-small outlined
             v-show="active && search">{{ $t('buttons.globalSearch') }}
      </v-btn>
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
    active: false,
    style: {
      maxWidth: '200px',
      transition: 'max-width 0.3s'
    }
  }),
  computed: {
    search: {
      get () {
        return this.$store.state.app.search
      },
      set (search) {
        this.$store.commit('SET_SEARCH', search)
      }
    }
  },
  methods: {
    focused () {
      this.active = true
      this.style.maxWidth = '500px'
    },
    blurred () {
      this.active = false
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
