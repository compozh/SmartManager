<template>
    <v-container fluid>
    <v-layout>
      <v-flex>
        <v-card flat px-2 v-if="lesson">
          <v-card-title >
            <h3>Материалы к уроку <span class="indigo--text">{{materials ? lesson.name : 'не предусиотрены'}}</span></h3>
          </v-card-title>
          <v-layout>
            <v-flex xl6 md6 sm12>
              <v-list v-if="materials">
                <v-list-group v-for="(material, index) in materials"
                              :key="index"
                              v-model="material.active"
                              :prepend-icon="material.icon"
                              v-if="material.enclosures"
                              no-action>
                  <template v-slot:activator>
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ material.title }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>
                  <v-list-tile
                    v-for="enclosure in material.enclosures"
                    :key="enclosure.id"
                    @click="getEnclosure(material.type, enclosure)"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title>{{ enclosure.title }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list-group>
              </v-list>
            </v-flex>
          </v-layout>
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
    },
    materials: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      materialsType: {
        file: 0,
        presentation: 1,
        link: 2
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
