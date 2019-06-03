<template>
  <v-container pa-0>
    <v-layout row wrap>
      <v-flex xs4 sm3 md2 lg1 d-flex justify-center align-center>
        <v-img class="user-icon"
               v-if="task.addedPhoto"
               :src="task.addedPhoto"
               contain
        ></v-img>
        <v-icon
          v-else
          size="50"
          color="#b3b3b3"
        >account_circle
        </v-icon>
      </v-flex>
      <v-flex xs8 sm9 md10 lg11 py-1 pr-2>
        <v-layout column text-xs-left>
          <v-flex>
            <span
              class="body-2 font-weight-light blue--text text--darken-2"
            >{{ task.name }}</span>
          </v-flex>
          <v-flex class="caption">
            <span>Исполнитель: {{ task.addedFio }}</span>
          </v-flex>
          <v-flex
            d-flex
            justify-space-between
            class="caption grey--text"
          >
            <span class="text-xs-left">Дата добавления: {{ task.dateAdd }}</span>
            <span class="text-xs-right">Плановая дата: {{ task.dateplan }}</span>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "sm-task-details",
    props: ['task']
  }
</script>

<style scoped>
  .user-icon {
    max-height: 50px;
    max-width: 50px;
    border-radius: 50%;
  }

</style>