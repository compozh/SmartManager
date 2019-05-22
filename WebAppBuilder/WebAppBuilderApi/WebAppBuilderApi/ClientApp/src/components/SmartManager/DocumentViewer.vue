<template>
    <div>
        <div v-if="whichFormat === 0">
            <textarea class="text" v-model="sorceText"></textarea>
        </div>
        <div v-if="whichFormat === 1">
            <pdf 
                v-for="i in numPages"
                :key="i"
                :src="fileUrl"
                :page="i"
                style="display: inline-block; width:100%"
            >
            </pdf>
        </div>
        <div v-if="whichFormat === 2">
            <img :src="fileUrl" class="document-image"/>
        </div>
    </div>
</template>

<script>
//https://github.com/FranckFreiburger/vue-pdf
import pdf from 'vue-pdf'
import axios from 'axios'
// arrayImageFormat : коллекция форматов картинок
const arrayImageFormat = ['bzg','png','jpg'];
export default {
    name:"documentViewer",
    components: {
        pdf
    },
    data(){
        return{
            //Страницы в файле pdf
            numPages: undefined,
            sorceText: '',
        }
    },
    computed:{
        // Определение формата файла
        fileFormat(){
            var splitFileName = this.fileName.split('.')
            return splitFileName[splitFileName.length-1]
        },
        
        // 0 отображение текста в textarea,
        // 1 отображение pdf
        // 2 отображение картинок
        whichFormat(){            
            if(!this.fileName || !this.fileUrl){
                return;
            }
            var whichFormat = -1
            var img = arrayImageFormat.filter(x=>x===this.fileFormat)
            var format = this.fileFormat
            if(img.length){
                format = 'img';
            }
            switch(format){
                case 'txt':
                    whichFormat = 0;
                    // Получение текста из текстового файла 
                    this.setTextFromFile();
                    break;
                case 'pdf':
                    whichFormat = 1;
                    // Загрузка всех страниц
                    var loadingTask = pdf.createLoadingTask(this.fileUrl);
                    loadingTask.then(pdf => {
                        this.numPages = pdf.numPages;
                    });
                    break;
                case 'img':
                    whichFormat = 2;
                    break;
            }
            return whichFormat;
           
        }      
    },
    methods:{
        // Получение текста из файла с форматом txt
        setTextFromFile(){
            axios.get(this.fileUrl).then(res => {
                this.sorceText = res.data;
            });
        }
    },

    // props:['fileName, fileUrl']
    // Имя файла Url файла
    props:['fileUrl', 'fileName']
}
</script>

<style scoped>
.text{
    width: 500px;
    height: 300px;
}
.document-image{
    max-width: 100%;
}
</style>
