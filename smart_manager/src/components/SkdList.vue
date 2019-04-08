<template>
  <div v-if="skdlist">
    <v-data-table :headers="skdlist.columns" :items="skdlist.data" :pagination.sync="pagSync">
      <template v-slot:items="props">
        <template v-for="col in skdlist.columns">
          <td :key="col.value">{{ props.item[col.value] }}</td>
        </template>
      </template>
    </v-data-table>
  </div>
</template>
<script>
export default {
  name: "skd-list",
  data:()=> ({
    pagSync:{
        rowsPerPage:-1
    }
  }),
  props: ["skdlist"]
};
</script>
<style>
</style>
