<template>
  <v-form v-model="valid">
    <v-container>
      <v-layout justify-center>
        <v-flex xs12 lg8 xl6>
          <v-layout row wrap>
            <v-flex class="text-xs-left hidden-md-and-up">
              <h2
                class="blue--text text--darken-2 font-weight-thin"
              >{{ $t('sm.tasks.newTask') }}
              </h2>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="newTask.title"
                :disabled="uploading"
                :label="$t('sm.tasks.taskName')"
                :rules="required"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <sm-task-add-form-select
                :label="$t('sm.tasks.performer')"
                :value="newTask.performerId"
                @input="newTask.performerId = $event"
                :rules="required"
                :uploading="uploading"
              ></sm-task-add-form-select>
            </v-flex>
            <v-flex xs12>
              <h3
                class="grey--text text--darken-1 font-weight-light text-xs-left"
              >{{ $t('sm.tasks.deadline') }}:
              </h3>
            </v-flex>
            <v-flex xs6>
              <v-menu
                ref="datePicker"
                v-model="datePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="newTask.date"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :value="dateFormatted"
                    :disabled="uploading"
                    :label="$t('sm.pickers.date')"
                    prepend-icon="event"
                    v-on="on"
                    :rules="dateRules"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="newTask.planDate"
                  :first-day-of-week="1"
                  :locale="$t('sm.pickers.locale')"
                  :min="minDate"
                  header-color="blue darken-2"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    color="primary"
                    @click="datePicker = false"
                  >{{ $t('sm.buttons.cancel') }}
                  </v-btn>
                  <v-btn
                    flat
                    color="primary"
                    @click="$refs.datePicker.save(newTask.planDate)"
                  >{{ $t('sm.buttons.ok') }}
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs6>
              <v-menu
                ref="timePicker"
                v-model="timePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="newTask.planTime"
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="newTask.planTime"
                    :disabled="uploading"
                    :label="$t('sm.pickers.time')"
                    prepend-icon="access_time"
                    v-on="on"
                    :rules="timeRules"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="timePicker"
                  v-model="newTask.planTime"
                  :format="$t('sm.pickers.timeFormat')"
                  full-width
                  header-color="blue darken-2"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    color="primary"
                    @click="timePicker = false"
                  >{{ $t('sm.buttons.cancel') }}
                  </v-btn>
                  <v-btn
                    flat
                    color="primary"
                    @click="$refs.timePicker.save(newTask.planTime)"
                  >{{ $t('sm.buttons.ok') }}
                  </v-btn>
                </v-time-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12>
              <v-textarea
                :label="$t('sm.tasks.description') + '...'"
                v-model="newTask.description"
                :disabled="uploading"
                rows="1"
                auto-grow
                clearable
              ></v-textarea>
            </v-flex>
            <v-flex xs12>
              <sm-task-add-form-select
                :label="$t('sm.roles.coExecutors')"
                :value="newTask.coexecutors"
                @input="newTask.coexecutors = $event"
                :uploading="uploading"
                multiple
              ></sm-task-add-form-select>
            </v-flex>
            <v-flex xs12>
              <sm-task-add-form-select
                :label="$t('sm.roles.notify')"
                :value="newTask.notify"
                @input="newTask.notify = $event"
                :uploading="uploading"
                multiple
              ></sm-task-add-form-select>
            </v-flex>
            <v-flex xs12>
              <v-layout wrap>
                <v-flex xs12>
                  <file-upload-add-task-form
                    v-on:attach="getAttachment($event)"
                    :uploading="uploading"
                  >
                  </file-upload-add-task-form>
                </v-flex>
                <v-flex xs12 class="button-container">
                  <v-spacer></v-spacer>
                  <v-btn @click="closeTaskAddForm">{{ $t('sm.buttons.cancel') }}</v-btn>
                  <v-btn
                    class="mr-0"
                    :disabled="!valid || uploading"
                    color="blue darken-2 white--text"
                    @click="upload"
                  >{{ $t('sm.buttons.create') }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import moment from 'moment'

export default {
  name: 'sm-task-add-form',
  props: {
    parent: Number
  },
  data() {
    return {
      uploading: false,
      newTask: {
        title: '',
        performerId: '',
        planDate: moment(new Date()).add(1, 'days').format('YYYY-MM-DD'),
        planTime: '12:00',
        description: '',
        coexecutors: [],
        notify: [],
        attachments: []
      },
      datePicker: false,
      timePicker: false,
      minDate: moment(new Date()).format('YYYY-MM-DD'),
      valid: false,
      required: [
        v => !!v || this.$t('sm.validate.required'),
      ],
      dateRules: [
        v => !!v || this.$t('sm.validate.needDate'),
        v => moment(v, 'DD.MM.YYYY', true).isValid() || this.$t('sm.validate.dateFormat'),
        v => moment(v, 'DD.MM.YYYY', true).add(1, 'days').isSameOrAfter() || this.$t('sm.validate.pastDate'),
      ],
      timeRules: [
        v => !!v || this.$t('sm.validate.needTime'),
        v => moment(v, 'HH:mm', true).isValid() || this.$t('sm.validate.timeFormat'),
      ]
    }
  },
  created() {
    this.getUsers()
    this.setMenuMode('close')
  },
  computed: {
    dateFormatted() {
      return this.newTask.planDate
        ? moment(this.newTask.planDate).format('DD.MM.YYYY')
        : ''
    }
  },
  methods: {
    upload() {
      this.uploading = true
    },
    getAttachment(event) {
      this.newTask.attachments = event
      this.createTask()
    },
    closeTaskAddForm() {
      this.uploading = false
      this.$store.commit('sm/setTaskAddForm', 'close')
    },
    createTask() {
      const newTask = {
        name: this.newTask.title,
        performerId: this.newTask.performerId,
        descript: this.newTask.description,
        dateplan: `${this.newTask.planDate} ${this.newTask.planTime}`,
        participants: this.getParticipants(),
        attachments: this.newTask.attachments,
        needApprove: false,
        needComm: false,
        priority: 0,
        parentTaskId: this.parent ? this.parent : ''
      }
      this.$store.dispatch('sm/addNewTask', newTask)
        .then(() => {
          if (this.parent) {
            this.$store.dispatch('sm/getTaskInfo', {
              taskId: this.parent,
              loader: 'setLinearLoader'
            })
          }
        })
    },
    getUsers() {
      const users = this.$store.state.sm.users
      if (users.length === 0) {
        this.$store.dispatch('sm/getUsers')
      }
    },
    setMenuMode(mode) {
      this.$store.commit('sm/setMenuMode', mode)
    },
    getParticipants() {
      const executor = [{userId: this.newTask.performerId, role: ''}]
      const coexecutors = this.newTask.coexecutors.map(i => {
        return {userId: i, role: 'COEXECUTOR'}
      })
      const observers = this.newTask.notify.map(i => {
        return {userId: i, role: 'OBSERVER'}
      })
      return [
        ...executor,
        ...coexecutors,
        ...observers
      ]
    }
  }
}
</script>

<style scoped>
  .button-container {
    display: flex;
    flex-wrap: wrap;
  }

  .upload-btn {
    display: flex;
    align-items: center;
  }
</style>
