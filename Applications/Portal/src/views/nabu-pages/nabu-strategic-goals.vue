<template>
  <div v-show="dataStrategicGoals">
    <vs-col vs-w="8">
      <AgGridView :education="dataStrategicGoals" v-show="dataStrategicGoals"></AgGridView>
    </vs-col>
    <vs-col vs-w="4">
      <ul class="file-container">
        <li v-for="(element, index) in employeeOriginal" :key="index" class="item-container" @mouseover="hoverElement(index)" @mouseleave="leaveElement(index)">
          <a class="link-text" id="my_iframe" :href="element.filePath" download >
             <div  class="download-container" >
              <div class="file-name">
                <documentFormat :format="element.format" :hover="testing[index].hover" />
                {{element.fileName}}
              </div>  
            </div>
          </a>
        </li>
      </ul>
    </vs-col>
  </div>
</template>

<script>
/* eslint-disable */

const AgGridView = () => import('../components/AgGridTableComponent.vue')
const documentFormat = () => import('../components/documentFormat.vue')
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
export default {
  data() {
    return {
      testing: null,
       settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 1,
      swipeEasing: true
    },
    }
  },
  components: {
    AgGridView,
    documentFormat,
    VuePerfectScrollbar,

  },
  created() {
    let object = {
      load: 'loadStrategicGoals',
      clear: 'setStrategicGoals'
    }
    
    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadStrategicGoals')
    
  },
  computed: {
    dataStrategicGoals() {
      return this.$store.getters['education/getStrategicGoals']
    },

    employeeOriginal() {
      let files = this.$store.getters['education/getEmployeeOriginal']
      
      if (!files) {
        return null
      }
      this.testing = files.map(x => {
        
        let format = x.fileName.split('.')

        let newFormat = format[format.length - 1]

        return {
          fileName: x.fileName,
          filePath: x.filePath,
          format: newFormat.toLowerCase(),
          hover: false
        }
      })
      return this.testing
    }
  },
  methods: {
    leaveElement(index) {
      this.testing[index].hover = false
    },
    hoverElement(index) {
      this.testing[index].hover = true
    }
  },
  
}
</script>

<style scoped>
.download-container{
margin-top: 5px;
margin-bottom: 5px;
}
.file-name{
  padding: 5px;
  display: flex;
  align-items: center;
}
.link-text{
  padding-left: 10px;
  width: 100%;
  height: 100%;
}
.item-container{
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
}
.item-container:hover{
    background: #ffffff;
    box-shadow: 0 0 5px rgba(0,0,0,0.5);
    border-radius: 5px;
}
.file-container{
  margin-top: 30px;
}

</style>
