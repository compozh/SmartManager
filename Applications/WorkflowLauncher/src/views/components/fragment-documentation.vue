<template>
    <div>
        <ul>
            <li v-for="(item, index) in items" :key="index" class="item-container" @click="FollowLink(item.link)">
                <div class="container">
                    <div class="inner-container">
                        <feather-icon :icon="item.image" class="icon" ></feather-icon>
                        <vx-tooltip :text="item.name" position="bottom" >
                            <span v-html="item.name" class="text"></span>
                        </vx-tooltip>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  props: ['items'],
  methods: {
    FollowLink(link) {
      window.open(link)
    }
  },
}
</script>
<style scoped>
::v-deep .vs-image--img{
	background-repeat: no-repeat;
}
.item-container{
    cursor: pointer;
}
.item-container:hover{
    background: #ffffff;
    box-shadow: 0 0 5px rgba(0,0,0,0.5);
    border-radius: 5px;
}
.container{
    display: flex;
    align-items: center;
    height: 50px;
}
.inner-container{
    display: flex;
	align-items: center;
    width: 100%;
}
.icon{
    padding-right: 10px;
}
.text{
    font-size: 16px
}
</style>