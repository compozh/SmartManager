<template>
  <div>
    <template v-if="userInfo">
      <!-- полный режим -->
      <vx-card v-if="!minMode">
        <div class="flex">
          <div>
            <vs-avatar :src="userPhoto" size="150px" />
          </div>
          <div class="flex-grow">
            <div class="p-3 flex items-center">
              <span class="w-48 text-grey pr-5">{{$t("PersonalInfo.FIO")}}</span>
              <span>{{userInfo.fullName}}</span>
            </div>
            <div class="p-3 flex items-center">
              <span class="w-48 text-grey pr-5">{{$t("PersonalInfo.BirthdayDate")}}</span>
              <span>{{userInfo.birthDate}}</span>
            </div>
            <div class="p-3 flex items-center">
              <span class="w-48 text-grey pr-5">{{$t("PersonalInfo.Gender")}}</span>
              <span>{{userInfo.gender}}</span>
            </div>
            <vs-divider></vs-divider>


            <!-- email -->
            <div class="p-3 flex items-center">
              <span class="w-48 text-grey pr-5">{{$t("PersonalInfo.Department")}}</span>
              <span v-if="!editMode">{{userInfo.departmentTitle}}</span>
              <vs-input v-else v-model="userInfo.departmentTitle"></vs-input>
            </div>
            <!-- телефон -->
            <div class="p-3 flex items-center">
                <span class="w-48 text-grey pr-5">{{$t("PersonalInfo.Control")}}</span>
                <span v-if="!editMode">{{userInfo.parentDepartmentTitle}}</span>
              <vs-input v-else v-model="userInfo.parentDepartmentTitle"></vs-input>
            </div>
            <!-- скайп -->
            <div class="p-3 flex items-center">
              <span class="w-48 text-grey pr-5">{{$t("PersonalInfo.Position")}}</span>
              <span v-if="!editMode">{{userInfo.positionCategory || "Не указан"}}</span>
              <vs-input v-else v-model="userInfo.positionCategory"></vs-input>
            </div>
          </div>
        </div>
      </vx-card>
      <!-- MinMode -->
      <vx-card v-else :title="$t('UserInfo')">
        <div class="flex">
          <div>
            <vs-avatar :src="userPhoto" size="50px" />
          </div>
          <div class="flex-grow">
            <div class="p-3">
              <span>{{userInfo.fullName}}</span>
            </div>

            <div class="p-3">
              <span class="text-grey pr-5">Email</span>
              <span>{{userInfo.email}}</span>
            </div>
            <div class="p-3">
              <span class="text-grey pr-5">{{$t("PersonalInfo.PhoneNumber")}}</span>
              <span>{{userInfo.phone}}</span>
            </div>
            <div class="p-3" v-if="userInfo.skype">
              <span class="text-grey pr-5">Skype</span>
              <span>{{userInfo.skype}}</span>
            </div>
          </div>
        </div>
      </vx-card>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inEditMode: 'phone',
    }
  },
  props: ['minMode'],
  created() {
    this.$store.dispatch('personalInfo/loadEmployeeInfo')
  },
  computed: {
    editMode() {
      return this.$store.state.personalInfo.userInfoEditMode
    },
    userPhoto() {
      if (!this.userInfo.photo) {
        return 'https://cdn1.iconfinder.com/data/icons/facebook-ui/48/additional_icons-03-256.png'
      }
      return this.userInfo ? `data:image/png;base64, ${this.userInfo.photo}` : ''
    },
    userInfo() {
      return this.$store.getters['personalInfo/getEmployeeInfo']
    }
  },
  methods: {
    onSave() {
      this.$store.dispatch('personalInfo/updateUserInfo', this.userInfo).then(() => this.onEndEdit())
    },
    onEndEdit() {
      this.$store.dispatch('personalInfo/setEditMode', false)
      this.setUserInfo()
    }
  }
}
</script>

<style>
</style>
