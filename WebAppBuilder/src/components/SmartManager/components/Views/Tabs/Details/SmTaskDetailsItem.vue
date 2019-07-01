<template>
  <sm-task-details-item-ext
    v-slot="{
      task,
      options,
      members,
      dateStatus
    }"
  >
    <v-container fluid pa-0 pr-2>
      <v-layout row wrap text-xs-left>
        <v-flex xs12 pt-2>
          <v-chip
            v-for="option in options"
            small outline disabled
            :color="option.color"
          >
            <v-avatar>
              <v-icon size="18">
                {{ option.icon }}
              </v-icon>
            </v-avatar>
            {{ option.title }}
          </v-chip>
        </v-flex>
        <v-flex xs12 py-2>
          <span
            class="subheading blue-grey--text"
          >{{ task.name }}</span>
        </v-flex>
        <v-flex xs12>
          <v-layout row wrap>
            <v-flex xs12>
              <v-layout
                v-for="role in members"
              >
                <v-flex
                  xs4 sm3 md2
                  grow text-xs-right
                  class="role-title">
                  <span class="title-field">
                    {{ role.title }}:
                  </span>
                </v-flex>
                <v-flex>
                  <v-chip
                    v-for="member in role.members"
                    small outline disabled
                    :color="role.color"
                  >
                    <v-avatar>
                      <v-icon size="18">
                        {{ role.icon }}
                      </v-icon>
                    </v-avatar>
                    {{ member }}
                  </v-chip>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row wrap py-2>
                <v-flex xs6 class="date-field">
                  <v-icon size="22">date_range</v-icon>
                  <span class="pl-1 pt-1 title-field">
                    Создано: <b class="subheading">{{ task.dateAdd }}</b>
                  </span>
                </v-flex>
                <v-flex xs6 class="date-field" justify-end>
                  <v-icon
                    :class="dateStatus"
                    size="22"
                  >date_range
                  </v-icon>
                  <span
                    class="pl-1 pt-1 title-field"
                    :class="dateStatus"
                  >
                    Срок до: <b class="subheading">{{ task.dateplan }}</b>
                  </span>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

      <sm-task-description
        v-if=task.htmlDescript
        :description="task.htmlDescript"
      ></sm-task-description>
    </v-container>
  </sm-task-details-item-ext>
</template>

<script>

  import moment from 'moment'

  export default {
    name: 'sm-task-details-item'
  }
</script>

<style scoped>
  .bottom-divider {
    box-shadow: inset 0 -1px 0 rgba(100, 121, 143, 0.122);
  }

  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .v-chip {
    height: 20px !important;
    font-size: 11px
  }

  .title-field {
    font-size: 12px;
    color: gray;
  }

  .role-title {
    padding-top: 2px;
  }

  .date-field .title-field b {
    font-size: 13px !important;
  }

  .date-field {
    display: flex;
    align-items: center;
  }

</style>