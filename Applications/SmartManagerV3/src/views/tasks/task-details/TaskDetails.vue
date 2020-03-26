<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col>
        <v-card class="fill-height">
          <v-card-title>
            TASK DETAILS ID - {{ $route.params.taskId }}
          </v-card-title>
          <v-divider/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TaskDetails'
}
</script>

<style scoped>

</style>
