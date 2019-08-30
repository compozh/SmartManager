<template>
      <vx-card
       :title="'# ' + item.number"
       :subtitle="'от ' + item.date"
       class="list-view-item mb-base overflow-hidden">
        {{item}}
      </vx-card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.list-view-item {
    .item-name, .item-description {
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
        transition: .35s;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0px 4px 25px 0px rgba(0,0,0,.25);

        .grid-view-img{
            opacity: 0.9;
        }
    }
}
</style>
