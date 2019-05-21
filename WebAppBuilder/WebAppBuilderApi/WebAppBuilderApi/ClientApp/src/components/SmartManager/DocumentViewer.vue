<template>
    <div v-if="Doc">
        <textarea class="text" v-model="formatText"  v-if="whichFormat === 0"></textarea>
        <pdf :src="formatPdf" v-if="whichFormat === 1">
        </pdf>
        <img :src="formatImage" v-if="whichFormat === 2"/>
    </div>
</template>

<script>
import pdf from 'vue-pdf'
import axios from 'axios'
export default {
    name:"documentViewer",
    components: {
        pdf
    },
    data(){
        return{
            // whichFormat : 
            // 0 отображение текста в textarea,
            // 1 отображение pdf
            // 2 отображение картинок
            whichFormat: -1,
            formatText: '',
            formatPdf: '',
            formatImage: '',
            // arrayImageFormat : коллекция форматов картинок
            arrayImageFormat:['bzg','png','jpg']
        }
    },
    computed:{
        Doc(){
            if(!this.document){
                return;
            }
            var format = this.document.fileName.split('.')[1]; 
            this.setFormat(format);
            
            return this.document;
        }
    },
    methods:{
        setFormat(format){
            // Проход по колллекции форматов картинок, поиск на совпадение
            var img = this.arrayImageFormat.filter(x=>x===format)
            if(img.length){
                format = 'img';
            }
            switch(format){
                case 'txt':
                    // Получение текста из текстового формата
                    axios.get(this.document.file).then(res => {
                        this.formatText = res.data;
                    });
                    this.whichFormat = 0;
                    break;
                case 'pdf':
                    this.formatPdf = this.document.file
                    this.whichFormat = 1;
                    break;
                case 'img':
                    this.formatImage = this.document.file
                    this.whichFormat = 2;
                    break;
            }
        }
    },
    props:['document']
}
</script>

<style scoped>
.text{
    width: 500px;
    height: 300px;
}
</style>
