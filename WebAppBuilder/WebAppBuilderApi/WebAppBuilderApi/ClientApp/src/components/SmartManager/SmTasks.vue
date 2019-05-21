<template>
  <v-container fluid pa-2>
    <v-layout column>
      <v-flex
        xs12
        mb-2
        v-for="task in tasks"
        :key="task.id"
      >
        <v-card class="title task-item">
          <v-layout row wrap align-center>
            <v-flex xs3 sm2 md1>
              <v-icon
                size="50"
                color="#b3b3b3"
              >account_circle
              </v-icon>
            </v-flex>
            <v-flex xs9 sm10 md11>
              <v-layout column text-xs-left>
                <v-flex>
                  <span
                    class="body-2 blue--text text--darken-2"
                  >{{task.name}}</span>
                </v-flex>
                <v-flex>
                  <span class="caption">Исполнитель: </span>
                  <span class="body-1">{{task.addedFio}}</span>
                </v-flex>
                <v-flex>
                  <v-card-actions class=" pl-0 caption grey--text">
                    Дата добавления: {{task.dateadd}}
                    <v-spacer></v-spacer>
                    Идентификатор: {{task.id}}
                  </v-card-actions>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
  export default {
    name: "sm-tasks",
    props: ["tasks"]
  };
</script>
<style scoped>
  .user-icon {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background-size: contain;
    background-position: center;
    margin-left: 25px;
  }

  .task-item:hover {
    cursor: pointer;
    background: rgb(250, 250, 250);
  }
</style>