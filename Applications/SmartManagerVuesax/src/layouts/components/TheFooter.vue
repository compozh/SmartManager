<!-- =========================================================================================
    File Name: TheFooter.vue
    Description: Footer component
    Component Name: TheFooter
========================================================================================== -->

<template functional>
    <footer class="the-footer flex-wrap justify-between" :class="classes">
        <span>{{ new Date().getFullYear() }} <a href="https://www.it.ua/" target="_blank" rel="nofollow">IT-Enterprise</a>, All rights Reserved</span>
        <span class="md:flex hidden items-center">
            <span>Hand-crafted & Made with</span>
            <feather-icon icon="HeartIcon" svgClasses="stroke-current text-danger w-6 h-6" class="ml-2" />
        </span>
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
