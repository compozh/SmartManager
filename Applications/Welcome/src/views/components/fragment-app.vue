<template>
	<div v-on:click="FollowLink()" class="section-container" @mouseover="mouseIsOver = true" @mouseleave="mouseIsOver = false">
		<vs-card class="card-component" >
			<div>
				<vs-images :hover="hover">
					<div class="image-header-container">
						<div class="content-container">
							<vs-image :src="image" :class="mouseIsOver ? 'image-container' : ''"></vs-image>
							<div class="header-container">
								<h1>{{name}}</h1>
							</div>
						</div>
					</div>
				</vs-images>
			</div>
			<div slot="footer">
				<div class="link-text-container">
					<h6 class="link-text" v-show="mouseIsOver">{{link}}</h6>
				</div>
				<vs-row vs-justify="flex-end"></vs-row>
			</div>
		</vs-card>
	</div>
</template>

<script>
export default {
  props: ['name', 'link', 'image'],
  name: 'fragment',
  data() {
    return {
      mouseIsOver: false,
      hover: 'none',
    }
  },
  methods: {
    FollowLink() {
      window.open(this.link)
    }
  }
}
</script>

<style scoped>
.section-container{
    cursor: pointer;
}
.link-text{
	font-size: 8px;
	color: #a7a5a5;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.link-text-container{
	height: 8px;
}
.card-header{
	text-align: center;
}
::v-deep .vs-card--header {
	background-color: #ff4757 !important
}
.header-text{
	color: white;
}
::v-deep .vs-image--img{
	background-repeat: no-repeat;
}
.card-component{
	background: none;
	background: white;
}
.card-component:hover{
	box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.image-header-container{
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
    justify-content: center;
}
.content-container{
	flex:1;
	display: flex;
	align-items: center;
}
.header-container{
	padding-left: 20%;
	white-space: nowrap;
}
.image-container{
	transform: scale(1.20);
}
</style>
