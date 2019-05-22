
<template>
	<v-container grid-list-md text-xs-center>
		<v-layout wrap="12">
			<v-flex xs2 >
				<div>
					<img class="img"  :src="TaskDetail.addedPhoto" alt="">
				</div>
				{{TaskDetail.addedFio}}<br/>
				{{TaskDetail.dateAdd}}
				{{TaskDetail.dateplan}}
				{{TaskDetail.name}}
			</v-flex> 
			<v-flex xs10>
				<originals-viewer :originals="TaskDetail.originals">
					<div slot-scope="{ originals, fileName, fileUrl, fileId, selectDocument }">
						<v-layout>
							<v-flex xs7>
								<documentViewer  v-bind:fileName="fileName" v-bind:fileUrl="fileUrl"/>
							</v-flex>
							<v-flex xs3>
								<div v-for="doc in originals" :key="doc.id">
									<span :class="fileId == doc.id ? 'selected' : ''" class="transfer" @click="selectDocument(doc.fileName, doc.file, doc.id)">{{ doc.fileName }}</span>
								</div>
							</v-flex>  
						</v-layout>
					</div>
				</originals-viewer>
			</v-flex>
		</v-layout>
  	</v-container>
</template>

<script>
export default {
	name: 'sm-task-info',
	computed:{
		TaskDetail(){
			if(this.$store.getters.getAppData("SMTASKINFO")){
				return this.$store.getters.getAppData("SMTASKINFO").data.smtasks.tasksGetInfo;
			}
			return {};
		},
	},
	methods:{
		loadDataForComponents(){
			var datasource = {
				query:`{ smtasks { tasksGetInfo(taskId:${this.$route.query.task_code}){ id  arso name status addedId dateAdd isAgree  addedFio comments{ date  text user } dateFact  dateplan  descript  keyValue priority originals{ id comm date  file ndor user fileName typeName typeDescription  } addedPhoto dateRemind docPlandate}}} `,
				schema:"SMARTMANAGER"
			}
			var key = "SMTASKINFO";
			this.$store.dispatch("LoadDataForComponent", {
				datasource,
				key
			});
    	},
    	// Функция для обновления данных при изменении роутинга
    	beforeRouteUpdate (to, from, next){
    		this.loadDataForComponents();
		},
	},
	beforeMount(){
    	this.loadDataForComponents();
	},
	
	props: ['taskinfo']
}
</script>
<style scoped>

.img{
  border-radius: 50%;
  margin-right: 30px;
  width: 150px;
  box-sizing: border-box;
}
.transfer{
	cursor: pointer;
}
.selected{
	background-color:yellowgreen;
}
</style>
