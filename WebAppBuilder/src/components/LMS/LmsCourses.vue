<template>
  <v-container v-if="courses">
    <Filters v-if='filtersData' :filters="filtersData"></Filters>
    <div v-for="(course, index) in courses" :key="index">
      <p>{{course.courseid}}</p>
      <router-link
        tag="a"
        :to="{name: 'LMSCOURSEDETAILS', params: {courseGuid: course.courseGuid}}">
          <a>{{course.name}}</a>
      </router-link>
    </div>
  </v-container>
</template>



<script>
export default {
	name:"lms-courses",
  props:["courses"],
  data(){
    return{
      filtersData: [
      {
        name: 'Роль',
        items: {code: 'А', name: 'Администратор', selected: false}
      },
      {
        name: 'Уровень',
        items: {code: 'B', name: 'Начальный', selected: false}
      },
      {
        name: 'Продукт',
        items: {code: 'BUH', name: 'Бухгалтерия', selected: false}
      },
      {
        name: 'Тэг',
        items: {}
      }
  ]
    }
  }
}
</script>