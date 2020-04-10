<template>
  <div class="equipment-images">
    <swiper v-if="images && images.length" :options="swiperOption">
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
      <viewer :images="imageUrls" @inited="inited" style="display:none;">
        <img v-for="(image,i) in images" :src="image.url" :key="i" />
      </viewer>
    </swiper>
    <img
      v-else-if="$vuetify.breakpoint.mdAndUp"
      :src="require('../equipment.png')"
      class="equipment-image"
    />
  </div>
</template>

<script>
import equipmentImages from '@/api/equipment/equipmentImages.gql'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'eam-equipment-images',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    equipmentId: String
  },
  apollo: {
    images: {
      query() {
        return this.query
      },
      variables() {
        return {
          id: this.equipmentId
        }
      },
      update(data) {
        const queryData = data[Object.keys(data)[0]]
        return queryData &&
          queryData.equipment &&
          queryData.equipment.images &&
          queryData.equipment.images.length
          ? queryData.equipment.images
          : queryData &&
            queryData.equipment &&
            queryData.equipment.model &&
            queryData.equipment.model.attachments
            ? queryData.equipment.model.attachments
            : null
      },
      skip() {
        return !this.equipmentId
      },
      error(e) {
        this.$store.commit(
          'eam/setError',
          e.gqlError
            ? 'Исключительная ситуация при вызове источника данных'
            : e.message
        )
      }
    }
  },
  data() {
    return {
      images: {},
      query: equipmentImages,
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

<style >
.slider,
.equipment-image {
  min-width: 15vw;
  min-height: 30vh;
  max-height: 50vh;
  max-width: 100%;
  margin: auto;
}
.equipment-images >>> .v-responsive {
  height: auto !important;
}
</style>
