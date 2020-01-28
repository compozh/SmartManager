<template>
    <ul>
        <li v-for="(item, index) in items" :key="index" class="item-container sm:item-container-size md:item-container-size lg:item-container-size xl:item-container-size" @click="FollowLink(item.link)">
            <vx-tooltip :text="item.name" position="left" >
                <div class="container">
                    <div class="inner-container truncate">
                        <feather-icon :icon="item.image" class="icon" ></feather-icon>
                        <span v-html="item.name" class="text"></span>
                    </div>
                </div>
            </vx-tooltip>
        </li>
    </ul>
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

@media (min-width: 768px) {
  .md\:item-container-size { 
    width: 60%;
    margin: auto;
   }
}
@media (min-width: 1024px) {
  .lg\:item-container-size { 
      width: 80%;
    }
}
@media (min-width: 1280px) {
  .xl\:item-container-size { 
      width: 80%;
      margin-right: 0;
    }
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
}
.icon{
    padding-right: 10px;
}
.text{
    font-size: 16px;
    max-width: 100%;
    margin: 0;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    justify-content: flex-start;
}
</style>