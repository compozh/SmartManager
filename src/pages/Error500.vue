<template>
  <v-container fluid class="fill-height justify-center">
    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-card class="d-flex flex-column align-center py-5">
          <v-img src="@/assets/images/error500.png"/>
          <p class="display-1 font-weight-light text-center mb-10">Internal Server Error!</p>
          <v-btn class="primary mb-10" max-width="200px" x-large to="/" >Back to home</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Error500'
}
</script>

<style scoped>

  a {
    background: rgb(137,48,253);
    background: linear-gradient(90deg, rgba(85,175,250,1) 0%, rgba(137,48,253,1) 100%);
  }

</style>
