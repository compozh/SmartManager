<template>
  <v-container fluid pa-0>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-icon v-if="task.priority" v-on="on" color="red darken-4">priority_high</v-icon>
      </template>
      <span>Высокий приоритет</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-icon v-if="task.hasOrig" v-on="on">attach_file</v-icon>
      </template>
      <span>Есть вложения</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-icon v-if="task.isAgree" class="ml-1" v-on="on">playlist_add_check</v-icon>
      </template>
      <span>Требует согласования</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-icon v-if="task.hasComm" class="ml-1" v-on="on">chat_bubble_outline</v-icon>
      </template>
      <span>Есть коментарии</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-icon v-if="task.isMy" class="ml-1" v-on="on">face</v-icon>
      </template>
      <span>Задача от меня</span>
    </v-tooltip>
  </v-container>
</template>

<script>
export default {
  name: 'SmTaskIcons',
  props: ['task']
}
</script>

<style scoped>

</style>
