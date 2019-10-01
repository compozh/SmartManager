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
              <span>{{userInfo.birthdayDate}}</span>
            </div>
            <div class="p-3 flex items-center">
              <span class="w-48 text-grey pr-5">{{$t("PersonalInfo.Adress")}}</span>
              <span>{{userInfo.adress}}</span>
            </div>
            <vs-divider></vs-divider>


            <!-- email -->
            <div class="p-3 flex items-center">
              <span class="w-48 text-grey pr-5">Email</span>
              <span v-if="!editMode">{{userInfo.email}}</span>
              <vs-input v-else v-model="userInfo.email"></vs-input>
            </div>
            <!-- телефон -->
            <div class="p-3 flex items-center">
                <span class="w-48 text-grey pr-5">{{$t("PersonalInfo.PhoneNumber")}}</span>
                <span v-if="!editMode">{{userInfo.phone}}</span>
              <vs-input v-else v-model="userInfo.phone"></vs-input>
            </div>
            <!-- скайп -->
            <div class="p-3 flex items-center">
              <span class="w-48 text-grey pr-5">Skype</span>
              <span v-if="!editMode">{{userInfo.skype || "Не указан"}}</span>
              <vs-input v-else v-model="userInfo.skype"></vs-input>
            </div>

            <vs-divider></vs-divider>


            <div class="p-3 flex items-center">
              <span class="w-48 text-grey pr-5">{{$t("PersonalInfo.Department")}}</span>
              <span>{{userInfo.departmentTitle}}</span>
            </div>

            <div class="p-3 flex items-center">
              <span class="w-48 text-grey pr-5">{{$t("PersonalInfo.HireDate")}}</span>
              <span>{{userInfo.hireDate}}</span>
            </div>

            <!-- панель кнопок -->
            <div v-if="editMode" class="p-3 flex items-center justify-end">
              <vs-button  type="filled" @click="onSave">Сохранить</vs-button>
              <vs-button type="flat" @click="onEndEdit">Отмена</vs-button>
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
      userInfo: undefined

    }
  },
  props: ['minMode'],
  created() {
    this.$store.dispatch('personalInfo/loadFullUserInfo').then(() => this.setUserInfo())
  },
  computed: {

    editMode() {
      return this.$store.state.personalInfo.userInfoEditMode
    },
    userPhoto() {
      return this.userInfo ? `data:image/png;base64, ${this.userInfo.photo}` : ''
    }
  },
  methods: {
    setUserInfo() {
      this.userInfo = {...this.$store.state.personalInfo.fullUserInfo}
    },
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
