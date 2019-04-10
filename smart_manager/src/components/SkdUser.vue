<template>
    
    <div v-if="this.user">
        <h1>{{this.user.fullName}}</h1>
        <!-- {{this.user}} -->
        <div class="skd-top">
            <div><img  :src="this.user.photoProperty.photoUrl" alt=""></div>
            <div class="skd-info">
                <div><span class='skd-title'>Место:</span>               <span class="skd-val"> {{this.user.placeName}}</span></div>
                <div><span class='skd-title'>Команда:</span>               <span class="skd-val"> {{this.user.department}}</span></div>
                <div><span class='skd-title'>Телефон (рабочий):</span>     <span class="skd-val"> {{this.user.workTel}}   </span></div>
                <div><span class='skd-title'>Телефон (мобильный):</span>   <span class="skd-val"> {{this.user.mobileTel}} </span></div>
                <div><span class='skd-title'>Email:</span>                 <span class="skd-val"> {{this.user.email}}     </span></div>
                <div><span class='skd-title'>Дата рождения:</span>         <span class="skd-val"> {{this.user.birthday}}  </span></div>
            </div>
        </div>  
    </div>
</template>
<script>
export default {
    name:"skd-user",
    props:['user']
}
</script>
<style lang="scss" scoped>
.skd-top {
    justify-content: center;
    margin: 30px;
    img{
        border-radius: 50%;
        margin-right: 30px;
        width: 150px;
        box-sizing: border-box;
    }
    display:flex;
    .skd-info{
        text-align: left;
    }
    .skd-title{
        color:gray;
    }
    .skd-val{
        padding-left: 3px;
        font-weight: 500;
    }
}

</style>


