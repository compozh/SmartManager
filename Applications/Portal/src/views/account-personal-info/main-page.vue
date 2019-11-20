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
              <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="10">
                <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="3">
                  <span class="w-48 text-grey pr-5">{{$t("PersonalInfo.FIO")}}</span>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="5">
                  <span>{{userInfo.fullName}}</span>
                </vs-col>
              </vs-col>
            </div>
            <div class="p-3 flex items-center">
              <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="10">
                <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="3">
                  <span class="w-48 text-grey pr-5">{{$t("PersonalInfo.BirthdayDate")}}</span>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="5">
                  <span>{{userInfo.birthDate}}</span>
                </vs-col>
              </vs-col>
            </div>
            <div class="p-3 flex items-center">
              <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="10">
                <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="3">
                <span class="w-48 text-grey pr-5">{{$t("PersonalInfo.Gender")}}</span>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="5">
                  <span>{{userInfo.gender}}</span>
                </vs-col>
              </vs-col>
            </div>
            <vs-divider></vs-divider>


            <!-- подразделение -->
            <div class="p-3 flex items-center">
              <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="10">
                <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="3">
                <span class="text-grey pr-5">{{$t("PersonalInfo.Department")}}</span>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="5">
                  <span v-if="!editMode">{{userInfo.departmentTitle}}</span>
                  <vs-input v-else v-model="userInfo.departmentTitle"></vs-input>
                </vs-col>
              </vs-col>
            </div>
            <!-- управление -->
            <div class="p-3 flex items-center">
              <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="10">
                <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="3">
                <span class=" text-grey pr-5">{{$t("PersonalInfo.Control")}}</span>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="5">
                 <span v-if="!editMode">{{userInfo.parentDepartmentTitle}}</span>
              <vs-input v-else v-model="userInfo.parentDepartmentTitle"></vs-input>
                </vs-col>
              </vs-col>
            </div>
            <!-- должность -->
            <div class="p-3 flex items-center">
              <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="10">
                <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="3">
                <span class="text-grey pr-5">{{$t("PersonalInfo.Position")}}</span>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="5">
                  <span v-if="!editMode">{{userInfo.positionCategory || "Не указан"}}</span>
                  <vs-input v-else v-model="userInfo.positionCategory"></vs-input>
                </vs-col>
              </vs-col>
              
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
        if(this.userInfo.photoFilePath){
          var fileFolder = this.userInfo.photoFilePath.split('?')[1]
        var file = fileFolder.split('&')[0]
        if (file.length == 5) {
          return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDU1IDQ1NSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDU1IDQ1NTsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjg0Mjk0MyAwIDAgMC44NDI5NDMgMzUuNzMwNCAzNS43MzA0KSI+PGc+Cgk8cGF0aCBkPSJNMzYwLjk2NywxMzAuNTk5Yy00LjA2LTAuODE4LTguMDE4LDEuOC04Ljg0MSw1Ljg2Yy0wLjgyMyw0LjA2LDEuODAxLDguMDE4LDUuODYsOC44NDEgICBjMS4xNDcsMC4yMzIsMi4wMTMsMS4yODYsMi4wMTMsMi40NXYxNjBjMCwxLjM1NS0xLjE0NSwyLjUtMi41LDIuNUgxNzkuNjc2Yy00LjE0MiwwLTcuNSwzLjM1Ny03LjUsNy41czMuMzU4LDcuNSw3LjUsNy41SDM1Ny41ICAgYzkuNjQ5LDAsMTcuNS03Ljg1MSwxNy41LTE3LjV2LTE2MEMzNzUsMTM5LjQ2LDM2OS4wOTksMTMyLjI0NywzNjAuOTY3LDEzMC41OTl6IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIGRhdGEtb2xkX2NvbG9yPSIjMDAwMDAwIiBzdHlsZT0iZmlsbDojNDg0QzUwNEQiPjwvcGF0aD4KCTxwYXRoIGQ9Ik0yNzQuODI0LDEzMC4yNUg5Ny41Yy05LjY0OSwwLTE3LjUsNy44NTEtMTcuNSwxNy41djE2MGMwLDguMDYzLDUuNDgsMTUuMDQ2LDEzLjMyNiwxNi45ODIgICBjMC42MDQsMC4xNDksMS4yMDgsMC4yMjEsMS44MDMsMC4yMjFjMy4zNjksMCw2LjQzMi0yLjI4Nyw3LjI3Ni01LjcwNWMwLjk5Mi00LjAyMS0xLjQ2My04LjA4Ni01LjQ4NC05LjA3OCAgIGMtMC45NTUtMC4yMzUtMS45Mi0xLjE0My0xLjkyLTIuNDJ2LTE2MGMwLTEuMzU1LDEuMTQ1LTIuNSwyLjUtMi41aDE3Ny4zMjRjNC4xNDIsMCw3LjUtMy4zNTcsNy41LTcuNSAgIFMyNzguOTY2LDEzMC4yNSwyNzQuODI0LDEzMC4yNXoiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgZGF0YS1vbGRfY29sb3I9IiMwMDAwMDAiIHN0eWxlPSJmaWxsOiM0ODRDNTA0RCI+PC9wYXRoPgoJPHBhdGggZD0iTTIzNS4zNjMsMTcwLjc5OGMtMi42NTUtMC4zNjMtNS4zLTAuNTQ4LTcuODYzLTAuNTQ4Yy0zMS43MDYsMC01Ny41LDI1Ljc5NC01Ny41LDU3LjVjMCwyLjU2MywwLjE4NSw1LjIwOSwwLjU0OCw3Ljg2MyAgIGMwLjUxNSwzLjc1OSwzLjczMSw2LjQ4Myw3LjQyMSw2LjQ4M2MwLjMzOSwwLDAuNjgyLTAuMDIzLDEuMDI3LTAuMDdjNC4xMDQtMC41NjIsNi45NzUtNC4zNDUsNi40MTMtOC40NDggICBjLTAuMjcxLTEuOTgyLTAuNDA5LTMuOTQzLTAuNDA5LTUuODI4YzAtMjMuNDM1LDE5LjA2NS00Mi41LDQyLjUtNDIuNWMxLjg4NCwwLDMuODQ1LDAuMTM4LDUuODI4LDAuNDA5ICAgYzQuMTA4LDAuNTY0LDcuODg2LTIuMzA5LDguNDQ4LTYuNDEzQzI0Mi4zMzgsMTc1LjE0MywyMzkuNDY3LDE3MS4zNTksMjM1LjM2MywxNzAuNzk4eiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBkYXRhLW9sZF9jb2xvcj0iIzAwMDAwMCIgc3R5bGU9ImZpbGw6IzQ4NEM1MDREIj48L3BhdGg+Cgk8cGF0aCBkPSJNMjE5LjEyNywyODQuNjM2YzIuNzg5LDAuNDA3LDUuNjA1LDAuNjE0LDguMzczLDAuNjE0YzMxLjcwNiwwLDU3LjUtMjUuNzk0LDU3LjUtNTcuNWMwLTIuNzctMC4yMDctNS41ODctMC42MTMtOC4zNzMgICBjLTAuNTk5LTQuMDk5LTQuNDA4LTYuOTM0LTguNTA1LTYuMzM3Yy00LjA5OSwwLjU5OS02LjkzNiw0LjQwNi02LjMzNyw4LjUwNWMwLjMwMywyLjA3MSwwLjQ1Niw0LjE1OCwwLjQ1Niw2LjIwNSAgIGMwLDIzLjQzNS0xOS4wNjUsNDIuNS00Mi41LDQyLjVjLTIuMDQ0LDAtNC4xMzItMC4xNTMtNi4yMDUtMC40NTZjLTQuMDk5LTAuNi03LjkwNywyLjIzOC04LjUwNSw2LjMzNyAgIFMyMTUuMDI4LDI4NC4wMzcsMjE5LjEyNywyODQuNjM2eiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBkYXRhLW9sZF9jb2xvcj0iIzAwMDAwMCIgc3R5bGU9ImZpbGw6IzQ4NEM1MDREIj48L3BhdGg+Cgk8cGF0aCBkPSJNMzE4LjUsMjAzLjI1YzkuMDk4LDAsMTYuNS03LjQwMiwxNi41LTE2LjVjMC04LjMxOC02LjIyNy0xNS4zNTUtMTQuNDg0LTE2LjM3Yy0yLjI5My0wLjI3Ny00LjU4NSwwLjUwOS02LjIxOCwyLjE0MiAgIGwtMTAuMDI3LDEwLjAyN2MtMS42MzMsMS42MzItMi40MjIsMy45MjYtMi4xNDEsNi4yMTdDMzAzLjE0NSwxOTcuMDIzLDMxMC4xODMsMjAzLjI1LDMxOC41LDIwMy4yNXoiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgZGF0YS1vbGRfY29sb3I9IiMwMDAwMDAiIHN0eWxlPSJmaWxsOiM0ODRDNTA0RCI+PC9wYXRoPgoJPHBhdGggZD0iTTExNy41LDExNC43NWgzMGM0LjE0MiwwLDcuNS0zLjM1Nyw3LjUtNy41cy0zLjM1OC03LjUtNy41LTcuNWgtMzBjLTQuMTQyLDAtNy41LDMuMzU3LTcuNSw3LjUgICBTMTEzLjM1OCwxMTQuNzUsMTE3LjUsMTE0Ljc1eiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBkYXRhLW9sZF9jb2xvcj0iIzAwMDAwMCIgc3R5bGU9ImZpbGw6IzQ4NEM1MDREIj48L3BhdGg+Cgk8cGF0aCBkPSJNMzg4LjM2Nyw2Ni42MzNDMzQ1LjM5NywyMy42NjQsMjg4LjI2OCwwLDIyNy41LDBTMTA5LjYwMywyMy42NjQsNjYuNjMzLDY2LjYzM0MyMy42NjQsMTA5LjYwMywwLDE2Ni43MzIsMCwyMjcuNSAgIHMyMy42NjQsMTE3Ljg5Nyw2Ni42MzMsMTYwLjg2N0MxMDkuNjAzLDQzMS4zMzYsMTY2LjczMiw0NTUsMjI3LjUsNDU1czExNy44OTctMjMuNjY0LDE2MC44NjctNjYuNjMzICAgQzQzMS4zMzYsMzQ1LjM5Nyw0NTUsMjg4LjI2OCw0NTUsMjI3LjVTNDMxLjMzNiwxMDkuNjAzLDM4OC4zNjcsNjYuNjMzeiBNMTUsMjI3LjVDMTUsMTEwLjMyNywxMTAuMzI3LDE1LDIyNy41LDE1ICAgYzU1Ljg5NCwwLDEwNi44MDcsMjEuNzAzLDE0NC43ODMsNTcuMTFMNzIuMTEsMzcyLjI4M0MzNi43MDMsMzM0LjMwNywxNSwyODMuMzk1LDE1LDIyNy41eiBNMjI3LjUsNDQwICAgYy01NS44OTQsMC0xMDYuODA3LTIxLjcwMy0xNDQuNzgzLTU3LjExTDM4Mi44OSw4Mi43MTdDNDE4LjI5NywxMjAuNjkzLDQ0MCwxNzEuNjA2LDQ0MCwyMjcuNUM0NDAsMzQ0LjY3MywzNDQuNjczLDQ0MCwyMjcuNSw0NDB6ICAgIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIGRhdGEtb2xkX2NvbG9yPSIjMDAwMDAwIiBzdHlsZT0iZmlsbDojNDg0QzUwNEQiPjwvcGF0aD4KPC9nPjwvZz4gPC9zdmc+'
        }
        return this.userInfo ? `data:image/png;base64, ${this.userInfo.photo}` : ''
      }
    },
    userInfo() {
      var test = this.$store.getters['personalInfo/getEmployeeInfo']
      console.log(test)
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

<style scoped>
.con-vs-avatar{
  background-color: white !important;
}


</style>
