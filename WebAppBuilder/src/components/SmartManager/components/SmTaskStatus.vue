<template>
  <v-container fluid pa-0>

    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-icon
          v-on="on"
          :color="taskStatus.color"
          class="ml-1"
          :size="22"
          :class="{'hidden-sm-and-up': chip}"
        >{{ taskStatus.icon }}
        </v-icon>
      </template>
      <span>{{ taskStatus.text }}</span>
    </v-tooltip>

    <v-chip
      v-if="chip"
      disabled
      small outline
      class="hidden-xs-only ma-0 ml-1"
      :color="taskStatus.color"
    >
      <v-avatar>
        <v-icon size="18">{{ taskStatus.icon }}</v-icon>
      </v-avatar>
      {{ taskStatus.text }}
    </v-chip>

  </v-container>
</template>

<script>
  export default {
    name: "sm-task-status",
    props: ['status', 'chip'],
    computed: {
      taskStatus() {
        switch (this.status) {
          case '':
            return {
              color: 'orange darken-2',
              icon: 'access_time',
              text: 'ожидает'
            }
          case '*':
            return {
              color: 'blue-grey darken-1',
              icon: 'loop',
              text: 'в работе'
            }
          case '-':
            return {
              color: 'red darken-2',
              icon: 'highlight_off',
              text: 'отклонена'
            }
          case '+':
            return {
              color: 'green darken-2',
              icon: 'check_circle_outline',
              text: 'выполнена'
            }
        }
      }
    }
  }
</script>

<style scoped>
  .v-chip {
    height: 22px !important;
    font-size: 12px
  }

  .v-chip >>> .v-chip__content {
    cursor: pointer;
  }
</style>
