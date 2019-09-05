<template>
  <vx-card  class="cursor-pointer list-view-item mb-5 overflow-hidden">
    <div @click="onClick" class="p-3" slot="no-body">
      <div class="flex items-center ">
        <vx-tooltip :text="item.number">
          <h5 :title="item.number" class="pr-3 w-48 truncate">{{item.number}}</h5>
        </vx-tooltip>

        <div class="text-grey pr-3">от {{item.date | moment("DD.MM.YYYY")}}</div>
        <vs-chip v-if="item.isPosted" color="primary">Разнесен</vs-chip>
        <div class="flex-grow"></div>
        <span class="text-grey">#{{item.id}}</span>
      </div>
      {{item.comment}}
    </div>
  </vx-card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    onClick() {
      this.$emit('click', this.item)
    }
  }

}
</script>

<style lang="scss" scoped>
.list-view-item {


  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);

    .grid-view-img {
      opacity: 0.9;
    }
  }
}
</style>
