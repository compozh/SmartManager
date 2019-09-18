<template>
  <v-container ma-0 class="main-info">
    <v-layout wrap justify-space-between>
      <v-flex d-flex xs12 md6 pt-2 :class="{'pr-2': $vuetify.breakpoint.mdAndUp}">
        <v-card min-width="200">
          <swiper :options="swiperOption" v-if="images">
            <swiper-slide
              contain
              v-for="(image,i) in images"
              :key="i"
              @click.native="show"
              style="display:flex; min-height: 50vh"
            >
              <img :src="image.url" class="slider" />
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
          <v-img v-else :src="require('../../equipment.png')"></v-img>
          <v-spacer></v-spacer>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{item.name}}</h3>
              <div>{{item.description}}</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 md6 pt-2>
        <v-list subheader dense>
          <v-subheader v-if="item.status" d-flex class="primary headline text-uppercase">Статус</v-subheader>
          <v-chip
            v-if="item.status"
            color="green"
            disabled
            style="width:99%; margin:0.5%"
            class="white--text subheading"
          >{{item.status.name}}</v-chip>

          <template v-for="(listItem,i) in infoListData">
            <v-subheader
              v-if="listItem.header"
              :key="i"
              class="primary headline text-uppercase"
            >{{ listItem.title }}</v-subheader>
            <v-list-tile v-else :key="i" avatar>
              <v-list-tile-avatar style="heigth:auto">
                <v-icon :color="listItem.color">{{ listItem.icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title style="white-space:normal">{{ listItem.title }}</v-list-tile-title>
                <v-list-tile-sub-title
                  style="white-space:normal"
                >{{ $vuetify.breakpoint.mdAndUp ? listItem.info : listItem.value }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action
                v-if="$vuetify.breakpoint.mdAndUp"
                style="white-space:normal"
              >{{ listItem.value }}</v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-flex>
      <viewer :images="imageUrls" @inited="inited" style="display:none;">
        <img v-for="(image,i) in images" :src="image.url" :key="i" />
      </viewer>
    </v-layout>
  </v-container>
</template>

<script>
import { EQUIPMENT_IMAGES } from '../../api/eam-queries.js'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'eam-equipment-main-info-card',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    item: Object
  },
  apollo: {
    images: {
      query() {
        return this.query
      },
      variables() {
        return {
          id: this.item.id
        }
      },
      update(data) {
        return data.eam && data.eam.equipment.images
          ? data.eam.equipment.images
          : null
      },
      skip() {
        return !(this.item && this.item.id)
      }
    }
  },
  data() {
    return {
      images: {},
      query: EQUIPMENT_IMAGES,
      swiperOption: {
        slidesPerView: 1,
        speed: 1000,
        centeredSlides: true,
        grabCursor: true,
        autoplay: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  },
  computed: {
    loading() {
      return this.$store.getters['eam/loading']
    },
    imageUrls() {
      return this.images ? Array.from(this.images).map(im => im.url) : null
    },
    infoListData() {      
      const items = []
      items.push({
        header: true,
        title: 'Основные данные'
      })
      if (this.item.itObject) {
        items.push({
          icon: 'home',
          title: 'Объект',
          value: this.item.itObject.name
        })
      }
      if (this.item.department) {
        items.push({
          icon: 'domain',
          title: 'Подразделение',
          value: this.item.department.name
        })
      }
      if (this.item.type) {
        items.push({
          icon: 'title',
          title: 'Тип',
          value: this.item.type.name
        })
      }
      if (this.item.model) { 
        items.push({
          icon: 'settings',
          title: 'Модель',
          value: this.item.model.name
        }) 
      }
      if (this.item.installDate) {
        items.push({
          icon: 'query_builder',
          title: 'Дата ввода в експл.',
          value: this.item.model.installDate
        })
      }
      if (this.item.factoryNumber) {
        items.push({
          icon: 'notes',
          title: 'Заводской номер',
          value: this.item.factoryNumber
        })
      }
      if (this.item.category) {
        items.push({
          icon: 'view_carousel',
          title: 'Категория',
          value: this.item.category.name
        })
      }

      if (this.item.responsibleEmployee) {
        items.push({
          header: true,
          title: 'Ответственный'
        })

        items.push({
          icon: 'person',
          color: 'blue',
          title: this.item.responsibleEmployee.fullName
        })
      }
      return items
    }
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer
    },
    show() {
      this.$viewer.show()
    }
  },
  watch: {
    '$apollo.loading'(value) {
      this.$store.commit('eam/setLoading', value)
    }
  }
}
</script>

<style>
.slider {
  min-width: 15vw;
  min-height: 30vh;
  max-height: 50vh;
  max-width: 100%;
  margin: auto;
}
.main-info >>> .v-list--dense .v-list__tile--avatar {
  height: auto;
}
.main-info >>> .v-list__tile__avatar {
  min-width: 10px;
  padding-right: 5px;
}
.main-info >>> .v-avatar {
  width: auto !important;
  padding-right: 5px;
}
.main-info >>> .v-responsive {
  height: auto !important;
}
</style>
