<template>
	<div class="main-paige-container">
		<vs-row vs-justify="center" class="section-container">
			<vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12" >
        <vs-col vs-w="7">
          <div class="header-container">
            <h1 class="header">Приложения</h1>
          </div>
        
          <FragmentApp v-for="(item, index) in apps" :key="index" 
            :name="item.name" 
            :link="item.link" 
            :image='item.image'>
          </FragmentApp>

        </vs-col>
        <vs-col vs-w="2">
          <div class="spacer"></div>
        </vs-col>

        <vs-col vs-w="3">
          <div class="header-container">
            <h1 class="header">Полезная информация</h1>
          </div>
          <FragmentDocumentation :items='documentations'></FragmentDocumentation>
        </vs-col>
			</vs-col>
		</vs-row>
		<vs-row  vs-justify="center" class="section-container">
			<vs-col type="flex" vs-justify="center" vs-align="center" vs-w="3" v-for="(item, index) in documentations" :key="index">
			</vs-col>
		</vs-row>
	</div>
</template>

<script>
import FragmentApp from '../components/fragment-app.vue'
import FragmentDocumentation from '../components/fragment-documentation.vue'
export default {
  name: 'welcome-main',
  computed: {
    apps() {
      /*eslint-disable*/ 
      return apps
      /*eslint-enable*/
    },
    documentations() {
      /*eslint-disable*/ 
      return documentation
      /*eslint-enable*/
    }
  },
  components: {
    FragmentApp,
    FragmentDocumentation
  }
}
</script>

<style scoped>
.header{
  font-size: 32px;
	padding: 20px;
  text-align: center;
  color: rgba(0,0,0,0.87);
}
.section-container{
	padding-top: 10px;
}
.spacer{
  width: 100px;
  height: 100px;
}
.header-container{
  border-bottom: 1px solid rgba(0,0,0,0.2);
  margin-bottom: 20px;
}
</style>
