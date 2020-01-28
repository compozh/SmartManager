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
      class="user-icon"
      :size="size"
      color="#b3b3b3"
    >mdi-account-circle
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
.user-image, .user-icon {
  display: flex;
  border-radius: 50%;
}

.user-icon {
  box-shadow:
    inset 1px 1px 0 0 #b3b3b3,
    inset -1px -1px 0 0 #b3b3b3,
    inset 1px -1px 0 0 #b3b3b3,
    inset -1px 1px 0 0 #b3b3b3;
}
</style>
