
<template>
	<v-container grid-list-md text-xs-center>
    	<v-flex xs12>
  			<renderless v-model="TaskDetail">
				<div slot-scope="{ task, curentDocument, transferToDocument }">
					<v-layout>
						<v-flex xs2 >
							<div>
        						<img class="img"  :src="task.addedPhoto" alt="">
      						</div>
							{{task.addedFio}}<br/>
							{{task.dateAdd}}
							{{task.dateplan}}
						</v-flex>  
						<v-flex xs7>
							{{task.name}}
							<documentViewer :document="curentDocument"/>
						</v-flex>
						<v-flex xs3>
							<div v-for="doc in task.originals" :key="doc.id">
								<span  class="transfer" @click="transferToDocument({file: doc.file, fileName: doc.fileName})">{{ doc.fileName }}</span>
							</div>
						</v-flex>  
					</v-layout>
				</div>
  			</renderless>
    	</v-flex>
  	</v-container>
</template>

<script>
export default {
	name: 'sm-task-info',
	data(){
		return{
			detailTask: undefined
		}
	},
	computed:{
		TaskDetail: {
			get: function(){
				if(this.$store.getters.getAppData("SMTASKINFO")){
					return this.$store.getters.getAppData("SMTASKINFO").data.smtasks.tasksGetInfo;
				}
					return {};
			},
			set:function(newValue){
				this.detailTask = newValue;
			}
		},
		CurentDocument(){
			if(!this.TaskDetail){
				return {}
			}
			if(!this.TaskDetail.originals){
				return {}
			}
			return this.TaskDetail.originals[0];
		}
	},
	methods:{
		loadDataForComponents(){
			var datasource = {
				query:'{ smtasks { tasksGetInfo(taskId:'+this.$route.query.task_code+'){ id  arso name status addedId dateAdd isAgree  addedFio comments{ date  text user } dateFact  dateplan  descript  keyValue priority originals{ id comm date  file ndor user fileName typeName typeDescription  } addedPhoto dateRemind docPlandate}}} ',
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
		PdfUrl(file){
			return { url : file, scale : 2};
		}
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
</style>
