<template>
  <vx-card  class="cursor-pointer list-view-item mb-5 overflow-hidden">
    <div @click="onClick" class="p-3" slot="no-body">
      <div class="flex items-center ">
        <h5 class="pr-3 w-48">{{item.number}}</h5>
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
  .item-name,
  .item-description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .item-name {
    -webkit-line-clamp: 2;
  }

  .item-description {
    -webkit-line-clamp: 5;
  }

  .grid-view-img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    transition: 0.35s;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);

    .grid-view-img {
      opacity: 0.9;
    }
  }
}
</style>
