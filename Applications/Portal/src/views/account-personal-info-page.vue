<template>
  <div>
    <template v-if="userInfo">
      <vx-card>
        <div class="flex">
          <div>
            <vs-avatar :src="userPhoto" size="150px" />
          </div>
          <div class="flex-grow">
            <div class="p-3">
              <span class="text-grey pr-5">ФИО</span>
              <span>{{userInfo.lastName}} {{userInfo.firstName}} {{userInfo.patronymic}}</span>
            </div>
            <div class="p-3">
              <span class="text-grey pr-5">Дата рождения</span>
              <span>{{userInfo.dateBirthday}}</span>
            </div>
            <div class="p-3">
              <span class="text-grey pr-5">Email</span>
              <span>{{userInfo.email}}</span>
            </div>
          </div>
        </div>
      </vx-card>
    </template>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('personalInfo/loadFullUserInfo')
  },
  computed: {
    userInfo() {
      return this.$store.state.personalInfo.fullUserInfo
    },
    userPhoto() {
      return `data:image/png;base64, ${this.userInfo.photo}`
    }
  }
}
</script>

<style>
</style>
