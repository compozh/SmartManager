<template>
  <div
    class="vs-sidebar--item"
    :class="[
        {'vs-sidebar-item-active':activeLink},
        {'disabled-item pointer-events-none': isDisabled},
        {'disabled-item pointer-events-none': isDisabled}
      ]"
  >
    <vs-divider v-if="to === '/cases/all'" class="my-1"/>

    <router-link v-if="to"
                 :to="to"
                 :class="[{'router-link-active': activeLink}]"
                 :target="target"
                 exact>
      <vs-icon v-if="!featherIcon"
               :icon-pack="iconPack"
               :icon="icon"/>
      <feather-icon :icon="icon"
                    :class="{'w-3 h-3': iconSmall}"
                    v-else/>
      <slot></slot>
    </router-link>

    <a v-else
      :target="target"
      :href="href">
      <vs-icon v-if="!featherIcon"
              :icon-pack="iconPack"
              :icon="icon"/>
      <feather-icon :icon="icon"
                    :class="{'w-3 h-3': iconSmall}"
                    v-else/>
      <slot></slot>
    </a>
  </div>
</template>

<script>
export default {
  name: 'VxSidebarItem',
  props: {
    icon: {
      default: '',
      type: String
    },
    iconSmall: {
      default: false,
      type: Boolean,
    },
    iconPack: {
      default: 'material-icons',
      type: String
    },
    href: {
      default: '#',
      type: String
    },
    to: {
      default: null,
      type: String
    },
    slug: {
      default: null,
      type: String
    },
    index: {
      default: null,
      type: [String, Number]
    },
    featherIcon: {
      default: true,
      type: Boolean,
    },
    target: {
      default: '_self',
      type: String,
    },
    isDisabled: {
      default: false,
      type: Boolean
    },
  },
  data() {
    return {
      activeLink: false,
    }
  },
  watch: {
    '$route'() {
      this.CheckIsActive()
    }
  },
  methods: {
    CheckIsActive() {
      if (this.to) {
        this.activeLink = !!((this.to === this.$router.path && this.to)
            || (this.$route.meta.parent === this.slug))
      }
    }
  },
  updated() {
    this.CheckIsActive()
  }
}
</script>
