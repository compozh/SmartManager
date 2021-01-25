<template>
  <div>
    <!-- Key password input -->
    <v-text-field v-model="password"
                  :label="$t('login.password')"
                  :placeholder="$t('login.passwordPlaceholder')"
                  outlined dense
                  name="password"
                  type="password"
                  hide-details
                  :disabled="loading"
                  autocomplete="off"
                  @keyup.enter="readPrivateKey"
                  class="body-1 clearable">
      <template #prepend-inner>
        <v-icon small class="pt-1 pr-2">fas fa-unlock</v-icon>
      </template>
      <template #append>
        <v-btn icon small class="clear-btn"
               @click="password = null">
          <fa-icon icon="times" type="fal" size="lg"/>
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script>
export default {
  name: 'EdsFileKey',
  props: ['signType']
}
</script>

<style scoped>

</style>
