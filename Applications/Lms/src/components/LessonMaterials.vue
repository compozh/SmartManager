<template>
  <v-container fluid py-0>
    <v-layout >
      <v-flex>
        <v-card flat px-2 v-if="lesson">
            <div class="body-1 px-3 py-3">Ресурсы урока <span class="indigo--text">{{lesson.name}}</span> <span v-if="!materials.length">&nbsp;не предусмотрены</span></div>
          <v-layout>
            <v-flex >
              <v-list v-if="materials" expand style="padding-top:0;!impotant">
                <v-list-group v-for="(material, index) in materials"
                              :key="index"
                              :prepend-icon="material.icon"
                              v-model="material.active"
                              no-action
                              >
                  <template v-slot:activator>
                    <v-list-tile >
                      <v-list-tile-content>
                        <v-list-tile-title class="body-2">{{ material.title }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>
                  <v-list-tile class="grey lighten-2"
                    v-for="enclosure in material.enclosures"
                    :key="enclosure.id"
                    @click="getEnclosure(material.type, enclosure)"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title class="body-1">{{ enclosure.title }}</v-list-tile-title>
                    </v-list-tile-content>
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
import {materialType, addTicketToLink} from '../helpers/lesson.js'

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
      materialType: materialType
    }
  },
  methods: {
    getEnclosure(type, enclosure) {
      // Передать данные слушателя и
      const link = type !== materialType.link ? addTicketToLink(enclosure.link) : enclosure.link
      window.open(link, enclosure.title)
    }
  }
}
</script>

<style>

</style>
