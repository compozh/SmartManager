<template>
  <v-layout fill-height>
    <v-flex class="width100 height100">
      <v-layout align-center column class="height100">
        <v-flex shrink
          class="width100">
          <v-card flat >
            <v-card-text v-if="commonInfo" class="test-title-colors">
              <v-layout justify-space-between>
                <v-flex pr-1>
                  <div :class="{subheading: !mobile, 'body-2': mobile}">
                    {{commonInfo.surveyName}}
                  </div>
                </v-flex>
                <v-flex shrink pl-1>
                  <div class="text-center" :class="{subheading: !mobile, 'body-2': mobile}">
                    Время теста: 15мин.
                  </div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex mx-3 class="overflow-scroll">
          <div class="py-3"
            v-html="commonInfo.surveyDescription">
          </div>
          <v-divider light></v-divider>
          <div v-if="commonInfo.attemptsAvailable < 10000"
            class="py-2">
            Доступное количество попыток: {{commonInfo.attemptsAvailable}}
          </div>
        </v-flex>
        <v-flex shrink>
          <v-btn
            flat
            class="green lighten-3"
            @click="start" >
              Начать
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
// import { isMobile } from '../helpers/application'
export default {
  name: 'test-start',
  props: ['mobile'],
  // data() {
  //   return {
  //     mobile: false
  //   }
  // },
  // created() {
  //   this.mobile = isMobile()
  // },
  methods: {
    start() {
      // выполнить инициализацию теста
      this.$store.dispatch('lms/initializeTest', {
        surveyId: this.commonInfo.surveyId,
        userId: this.commonInfo.userId
      })
      this.$store.commit('lms/setCurrentTestPage', 'test-passing')
    }
  },
  computed: {
    commonInfo() {
      return this.$store.getters['lms/testCommonInfo']
    }
  }
}
</script>

<style>
.width100 {
  width: 100%;
}
.width80 {
  width: 80%;
}
.test-title-colors {
  color: #fff;
  background-color: #3F51B5;
}
.text-center {
  text-align: center;
}
.overflow-scroll{
  overflow: auto;
}
.v-input .v-label {
  font-size: 1.0rem;
  color: rgb(17, 17, 17);
}
</style>
