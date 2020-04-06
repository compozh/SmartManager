<template>
    <Split style="flex-basis: 0; border-radius: 5px;"
           class="flex-grow-1 overflow-hidden white">
      <!-- LEFT CONTENT AREA -->
      <SplitArea class="d-flex flex-column">
        <!-- LEFT HEADER -->
        <div class="side-header pa-5">
          <v-avatar color="grey lighten-1" class="mr-3" size="40px">
            <fa-icon v-if="!task.performerPhoto" :icon="['fal', 'user']" inverse/>
            <v-img v-else :src="task.performerPhoto"/>
          </v-avatar>
          <span class="body-2">{{ task.performer }}</span>
          <v-spacer></v-spacer>
          <v-btn small depressed color="primary" class="mr-2">IN PROGRESS</v-btn>
          <v-btn small outlined color="success">
            <fa-icon :icon="['fal', 'check']" size="lg"/>
          </v-btn>
        </div>
        <!-- LEFT SCROLL AREA -->
        <perfect-scrollbar class="pa-5">
          <h3 v-if="task.docCaption" class="mb-3">
            {{ task.docCaption }}
          </h3>
          <h3 v-if="task.name !== task.docCaption" class="font-weight-light mb-3">
            {{ task.name }}
          </h3>
          <div class="d-flex mb-3">
            <div v-if="task.priority" class="deep-orange--text">
              <fa-icon :icon="['fal', 'exclamation-square']" class="mr-2"/>
              <span class="caption">{{ $t('icons.priority') }}</span>
              <v-divider vertical class="mx-2"></v-divider>
            </div>
            <div v-if="task.myControl" class="red--text text--darken-4">
              <fa-icon :icon="['fal', 'eye']" class="mr-2"/>
              <span class="caption">{{ $t('icons.control') }}</span>
            </div>
            <v-spacer/>
            <div>
              <fa-icon :icon="['fal', 'print']" class="blue--text text--darken-4"/>
              <fa-icon :icon="['fal', 'history']" class="mx-3 green--text"/>
              <fa-icon :icon="['fal', 'expand-alt']" class="grey--text"/>
            </div>
          </div>
          <!-- HTML DESCRIPTION-->
          <div v-if="htmlDescription" class="border-light mb-5">
            <iframe seamless
                    scrolling="no"
                    width="100%"
                    :height="iFrameHeight1"
                    frameborder="0"
                    :srcdoc="htmlDescription"
                    @load="iFrameOnLoad(1, $event)"
                    style="pointer-events: none"/>
          </div>
          <div v-if="docTextHtml" class="border-light mb-5">
            <iframe seamless
                    scrolling="no"
                    width="100%"
                    :height="iFrameHeight2"
                    frameborder="0"
                    :srcdoc="docTextHtml"
                    @load="iFrameOnLoad(2, $event)"
                    style="pointer-events: none"/>
          </div>
          <p v-if="task.name !== task.descript" class="mb-5">{{ task.descript }}</p>
          <!-- PROGRESS-->
          <div class="d-flex mb-5 align-center">
            <v-chip small color="blue-grey"
                    label text-color="white">
              <fa-icon :icon="['fal', 'hurricane']" class="mr-3"/>
              {{ typeName }}
            </v-chip>
            <v-divider vertical class="mx-2"></v-divider>
            <v-chip small :color="taskStatus().color"
                    label text-color="white">
              <fa-icon :icon="['fal', taskStatus().icon]" class="mr-3"/>
              {{ taskStatus().text }}
            </v-chip>
          </div>
          <v-divider></v-divider>
          <!-- TASK ATTACHMENTS -->
          <div class="my-5">
            <fa-icon :icon="['fal', 'paperclip']" class="mr-3" size="lg"/>
            <span>{{ $t('tabs.attachments').toUpperCase() }}</span>
            <div class="py-2">
              <v-chip v-for="item in task.originals" :key="item.id" class="my-2 mr-2" @click="() => ({})">
                <fa-icon :icon="['fal', 'file-alt']" class="mr-3"/>
                <span>{{ item.fileName }}</span>
              </v-chip>
            </div>
          </div>
          <!-- BASE TASK -->
          <div v-if="baseTask" class="my-5">
            <fa-icon :icon="['fal', 'tasks-alt']" class="mr-3" size="lg"/>
            <span>{{ $t('tasks.base').toUpperCase() }}</span>
            <data-iterator :tasks="[baseTask]" class="mt-3"/>
          </div>
          <!-- PARENT TASKS -->
          <div v-if="task.parentTasks" class="my-5">
            <fa-icon :icon="['fal', 'tasks-alt']" class="mr-3" size="lg"/>
            <span>PARENT TASKS</span>
            <data-iterator :tasks="task.parentTasks" class="mt-3"/>
          </div>
          <!-- SUB TASKS-->
          <div v-if="childTasks" class="my-5">
            <fa-icon :icon="['fal', 'tasks-alt']" class="mr-3" size="lg"/>
            <span>{{ $t('tasks.subTasks').toUpperCase() }}</span>
            <data-iterator :tasks="childTasks" class="mt-3"/>
          </div>
        </perfect-scrollbar>
      </SplitArea>
      <!-- RIGHT CONTENT AREA -->
      <SplitArea class="d-flex flex-column">
        <v-tabs v-model="tab" grow height="75px">
          <v-tab>
            <fa-icon :icon="['fal', 'paperclip']" class="mr-3" size="lg"/>
            {{ $t('tabs.attachments') }}
          </v-tab>
          <v-tab>
            <fa-icon :icon="['fal', 'comment-alt-dots']" class="mr-3" size="lg"/>
            {{ $t('tabs.comments') }}
          </v-tab>
        </v-tabs>
          <attachments v-if="tab === 0"></attachments>
          <comments v-if="tab === 1"></comments>
      </SplitArea>
    </Split>
</template>

<script>
import DataIterator from '@/views/tasks/task-list/DataIterator'
import Attachments from '@/views/attachments/Attachments.vue'
import Comments from '@/views/comments/Comments.vue'
import { tasks } from '@/mixins/units'

export default {
  name: 'TaskDetails',
  mixins: [tasks],
  components: {
    DataIterator,
    Attachments,
    Comments
  },
  data: () => ({
    tab: 1,
    iFrameHeight1: 250,
    iFrameHeight2: 250
  }),
  computed: {
    docTextHtml () {
      return this.parseDescription(this.task.docTextHtml)
    },
    htmlDescription () {
      return this.parseDescription(this.task.htmlDescript)
    },
    parseDescription () {
      return description => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(description, 'text/html')
        const body = doc.body.innerHTML.trim()
        return body ? description : body
      }
    },
    baseTask () {
      return this.task.parentTask && this.task.parentTask.id
        ? this.task.parentTask
        : null
    },
    childTasks () {
      return this.task.childTasks && this.task.childTasks.length
        ? this.task.childTasks
        : null
    },
    taskType () {
      return this.task ? this.task.taskType : null
    },
    typeName () {
      switch (this.taskType) {
        case '': return 'обычная задача/документ'
        case 'AGREE': return 'согласование'
        case 'WORKFLOW': return 'выполнение БП'
        case 'EXTERNAL': return 'внешняя задача'
        default: return 'unknown type'
      }
    },
    taskStatus () {
      return () => {
        switch (this.task.status) {
          case '-':
            return {
              color: 'error',
              icon: 'exclamation-circle',
              text: this.$t('statuses.rejected')
            }
          case '+':
            return {
              color: 'success',
              icon: 'check-circle',
              text: this.$t('statuses.done')
            }
          default:
            return {
              color: 'primary',
              icon: 'recycle',
              text: this.$t('statuses.inWork')
            }
        }
      }
    }
  },
  created () {
    this.getTask()
  },
  methods: {
    iFrameOnLoad (frame, event) {
      const iFrameBody = event.path[0].contentDocument.body
      this['iFrameHeight' + frame] = iFrameBody.scrollHeight * 1.2
      iFrameBody.style.fontFamily = 'Roboto, sans-serif'
    }
  }
}
</script>

<style scoped>

  /* TODO: output border-light class to common styles */
  .border-light {
    border: 1px solid #e5e5e5;
    border-radius: 5px;
  }

 .side-header {
   display: flex;
   align-items: center;
   min-height: 75px;
   max-height: 75px;
   border-bottom: 1px solid #e5e5e5;
 }

</style>
