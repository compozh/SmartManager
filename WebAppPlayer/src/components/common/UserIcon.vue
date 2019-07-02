<template>
  <div>
    <v-img class="user-image"
           v-if="src"
           :src="src"
           :height="size + 'px'"
           :width="size + 'px'"
           contain
    ></v-img>
    <v-icon
      v-else
      :size="size"
      color="#b3b3b3"
    >account_circle
    </v-icon>
  </div>
</template>

<script>
export default {
  name: 'userIcon',
  props: ['src', 'size'],
}
</script>

<style scoped>
  .user-image {
    border-radius: 50%;
  }

  .border {
    border: 2px solid #b3b3b3;
    border-radius: 50%;
  }
</style>
