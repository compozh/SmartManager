<template>
    <div class="p-6 md:px-6 sm:px-2 xs:px-2 flex flex-col">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="flex justify-between items-center mt-4 cursor-pointer"
        :class="{'text-primary': currentTab === item.name}"
        @click="$emit('changeTab', item.name)"
      >
        <div class="flex items-center mb-2">
          <feather-icon :icon="item.icon"></feather-icon>
          <span class="text-lg ml-6 lg:ml-3">{{ $t(`tabs.${item.name}`) }}</span>
        </div>
        <vs-chip
          v-if="chips(item.name)"
          class="number"
          :color="item.chipColor"
        >{{ chips(item.name) }}</vs-chip>
      </div>
    </div>
</template>

<script>

export default {
  props: {
    currentTab: String,
    attachments: Array,
    comments: Array,
  },
  data: () => ({
    menuItems: [
      {name: 'details', icon: 'AlertCircleIcon'},
      {name: 'attachments', icon: 'PaperclipIcon', chipColor: 'primary'},
      {name: 'comments', icon: 'MessageSquareIcon', chipColor: 'warning'}
    ]
  }),
  computed: {
    chips() {
      return itemName => {
        switch (itemName) {
          case 'attachments': return this.attachments.length
          case 'comments': return this.comments.length
        }
      }
    }
  }
}
</script>
