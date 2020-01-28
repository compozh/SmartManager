<template>
    <v-container fluid>
    <v-layout>
      <v-flex>
        <v-card flat px-2 v-if="lesson">
          <v-card-title >
            <h3>Материалы к уроку <span class="indigo--text">{{lesson.name}}</span></h3>
          </v-card-title>
          <v-list>
            <v-list-group v-for="item in lesson.materials"
                          :key="item.id"
                          v-model="item.active"
                          :prepend-icon="item.icon"
                          v-if="item.enclosures"
                          no-action>
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
              <v-list-tile
                v-for="enclosure in item.enclosures"
                :key="enclosure.id"
                @click="getEnclosure(item.type, enclosure)"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{ enclosure.title }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'lesson-materials',
  props: {
    lesson: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      materialsType: {
        'presentation': 1,
        'documet': 2,
        'link': 3
      },
    }
  },
  methods: {
    getEnclosure(type, enclosure) {
      // Передать данные слушателя и
      window.open(enclosure.link, enclosure.title)
    }
  }
}
</script>

<style>

</style>
