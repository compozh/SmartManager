<!-- =========================================================================================
    File Name: TheFooter.vue
    Description: Footer component
    Component Name: TheFooter
========================================================================================== -->

<template functional>
    <footer class="the-footer flex-wrap justify-between" :class="classes">
        <span>{{ new Date().getFullYear() }} <a href="https://www.it.ua/" target="_blank" rel="nofollow">IT-Enterprise</a>, All rights Reserved</span>
    </footer>
</template>

<script>

export default {
  name: 'the-footer',
  props: {
    classes: {
      type: String,
    },
  }
}
</script>
