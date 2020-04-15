<template>
  <!-- Список уроков по модулям -->
  <v-layout fill-height>
    <v-flex>
      <v-card
        color="grey lighten-2"
        flat
        v-for="(moduleItem, index) in modules" :key="moduleItem.moduleGuid">
        <div class="pl-3 py-1">
          <v-layout nowrap align-center justify-space-between>
            <v-flex>
              <div class="subheading font-weight-bold">{{moduleItem.name}}</div>
              <div class="body-1">
                {{ moduleItem.durationMinutesLabel + ` (${lessonsModulePassed(moduleItem.moduleGuid)} / ${moduleItem.units.length})`}}
              </div>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex shrink>
              <v-btn icon @click="openClose(index)" color="white">
                <v-icon>{{ isActive(index) ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
        <v-card-text v-show="isActive(index)" class="white py-0 px-0">
          <v-layout>
            <v-flex>
              <div
                  v-for="lesson in moduleItem.units"
                  :key="lesson.lessonGuid"
                  :class="{'active': lesson.lessonGuid === currentLessonGuid}"
                  class="lesson-item">
                <v-layout nowrap justify-start>
                  <v-flex pl-3 shrink align-self-center>
                    <v-checkbox
                      v-model="lessonsPassed"
                      :value="lesson.lessonGuid"
                      :disabled="lesson.disabled"
                      @change="changeLessonsPassedList"
                      height="6">
                    </v-checkbox>
                  </v-flex>
                  <v-flex @click="setLesson(lesson.lessonGuid)">
                    <v-layout column>
                      <v-flex>
                        <v-layout>
                          <v-flex align-self-center>
                            <div><span class="grey--text text--darken-2">{{lesson.name}}</span></div>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                    <v-layout nowrap>
                      <v-flex shrink>
                        <v-icon small color="grey lighten-1">{{lesson.icon}}</v-icon>
                      </v-flex>
                      <v-flex>
                        <span class="ml-3 caption grey--text text-darken-1">{{lesson.durationMunute | timeFormat}}</span>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'lessons-menu',
  props: {
    modules: Array,
    currentLessonId: String,
    passedList: Array
  },
  data() {
    return {
      lessonsPassed: [],
      navigation: {
        modules: []
      }
    }
  },
  created() {
    this.navigation.modules = this.initMenu()
    this.lessonsPassed = this.passedList
  },
  methods: {
    initMenu() {
      return this.modules.map( m => {
        return {
          moduleGuid: m.moduleGuid,
          active: true
        }
      })
    },
    changeLessonsPassedList() {
      this.$emit('change-list', this.lessonsPassed)
    },
    lessonsModulePassed(moduleGuid) {
      const moduleItem = this.modules.find(m => m.moduleGuid === moduleGuid)
      let lessonModulePassed = 0
      for (let i = 0; i < this.lessonsPassed.length; i++) {
        if (moduleItem.units.some(u => u.lessonGuid === this.lessonsPassed[i])) {
          lessonModulePassed++
        }
      }
      return lessonModulePassed
    },
    openClose(index) {
      this.navigation.modules[index].active = !this.navigation.modules[index].active
    },
    isActive(index) {
      return this.navigation.modules[index].active
    },
    setLesson(lessonGuid) {
      this.$emit('set-current-lesson', lessonGuid)
    }
  },
  computed: {
    lessonsPassedQty() {
      this.changeLessonsPassedList()
      return this.lessonsPassed.length
    },
    currentLessonGuid() {
      return this.currentLessonId
    }
  },
  filters: {
    timeFormat(value) {
      let minutesVal = value % 60
      let hoursVal = Math.floor(value / 60)
      let minutesStr = minutesVal.toString()
      let hoursStr = hoursVal.toString()
      let hourse = hoursStr.length > 1 ? hoursStr : '0' + hoursStr
      let minutes = minutesStr.length > 1 ? minutesStr : '0' + minutesStr
      return `${hourse}:${minutes}`
    }
  }
}
</script>

<style>
.active {
  background: #E1F5FE;
}
.lesson-item {
  border-top: solid 1px #E0E0E0;
  cursor: pointer;
}
.lesson-item:hover {
  background: #EEEEEE;
}
</style>
