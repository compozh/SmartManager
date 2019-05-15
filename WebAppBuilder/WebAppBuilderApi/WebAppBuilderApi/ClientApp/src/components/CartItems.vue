<template>
  <div v-if="skdlist">
    <v-data-table :headers="skdlist.columns" :items="skdlist.data" :pagination.sync="pagSync">
      <template v-slot:items="props">
        <template v-for="col in skdlist.columns" >
          <td :key="col.value">
            
            <router-link v-if="props.item.userId && col.value == 'fullName'" :to="{ name:'SKDUSER', params:{userid:props.item.userId}}"> {{ props.item[col.value] }}</router-link>
            <span v-else>{{ props.item[col.value] }}</span>
            </td>
        </template>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
    name: "cart-list",
    data:()=> ({
        pagSync:{
            rowsPerPage:10
        }
    }),
    props: ["cartlist"]
};

</script>