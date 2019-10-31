<template>
	<div class="sm:main-paige-container-size md:main-paige-container-size lg:main-paige-container-size xl:main-paige-container-size">
    <!-- <vx-sidebar class="test"></vx-sidebar>
		<vs-row vs-justify="center" class="section-container">
			<vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12" >
        <vs-col vs-w="1"> -->
          <!-- <div class="spacer"></div>
        </vs-col> -->
        <!-- <vs-col vs-w="5"> -->
          <div class="sm:app-container-size md:app-container-size lg:app-container-size xl:app-container-size">
            <div class="header-container">
              <h1 class="header">{{$t("Welcome.Apps")}}</h1>
            </div>
            <FragmentApp v-for="(item, index) in apps" :key="index" 
              :name="item.name" 
              :link="item.link" 
              :image='item.image'
              class="sm:app-size md:app-size lg:app-size xl:app-size"
              >
            </FragmentApp>
          </div>
         
        
         

        <!-- </vs-col> -->
        <!-- <vs-col vs-w="3">
          <div class="spacer"></div>
        </vs-col> -->

        <!-- <vs-col vs-w="3"> -->
          <div class="sm:document-container-size md:document-container-size lg:document-container-size xl:document-container-size">
            <div class="header-container">
              <h1 class="header">{{$t("Welcome.HelpFullInfo")}}</h1>
            </div>
            <FragmentDocumentation :items='documentations'></FragmentDocumentation>
          </div>
          <div>

          </div>
        <!-- </vs-col>
			</vs-col>
		</vs-row> -->
		<!-- <vs-row  vs-justify="center" class="section-container"> -->
			<!-- <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="3" v-for="(item, index) in documentations" :key="index"> -->
			<!-- </vs-col> -->
		<!-- </vs-row> -->
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
    },
    breakpoint() {
      return this.$store.state.breakpoint
    },
  },
  components: {
    FragmentApp,
    FragmentDocumentation,
  }
}
</script>

<style scoped>
@media (max-width: 640px) {
  .sm\:main-paige-container-size { 
    width: 100%;
  }
}
@media (min-width: 640px) {
  .sm\:main-paige-container-size { 
    width: 100%;
  }
}
@media (min-width: 768px) {
  .md\:main-paige-container-size { 
    width: 100%;
  }
  .md\:app-container-size { 
    width: 100%;
  }
  .md\:document-container-size { 
    width: 100%;
    margin-left: auto;
  }
  .md\:app-size { 
    width: 100%;
  }
}
@media (min-width: 1024px) {
  .lg\:main-paige-container-size { 
    display: flex;
    width: 100%;  
  }
  .lg\:app-container-size { 
    margin-left: 50px;
    margin-right: 100px;
    flex:2;
  }
  .lg\:document-container-size { 
    flex:1;
    margin-right: 10px;
  }
  .lg\:app-size { 
    width: 800px;
    margin: auto;
  }
}
@media (min-width: 1280px) {
  .xl\:main-paige-container-size { 
    display: flex;
    width: 100%;  
  }
  .xl\:app-container-size { 
    margin-left: 50px;
    margin-right: 100px; 
    flex:2;
  }
  .xl\:document-container-size { 
    flex:1;
    margin-right: 10px;
  }
  .xl\:app-size { 
    width: 800px;
    margin: auto;
  }
}

.header{
  font-size: 32px;
	padding: 20px;
  text-align: center;
  color: rgba(0,0,0,0.87);
  cursor: default;
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
