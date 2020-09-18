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
    clear-icon="+"
    class="body-2 align-center">

    <template #label>
      <span class="body-2">{{ $t('search') }}</span>
    </template>

    <template #prepend>
      <fa-icon icon="search"/>
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

<style scoped>

  .v-input >>> input {
    padding-bottom: 6px;
  }

  .v-input >>> .v-input__append-inner > div > button {
    transform: rotate(45deg);
    font-size: 30px;
    user-select: none;
    margin-top: 0.1em;
 }

  .v-text-field >>> .v-label {
    top: 4px !important;
  }

</style>
