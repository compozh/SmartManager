<template>
  <v-card>
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
    <v-spacer></v-spacer>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{item.fullName}}</h3>
        <div>{{item.description}}</div>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
import inspectionAttachments from '@/api/inspections/inspectionAttachments.gql'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'eam-inspection-attachments-card',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    id: String
  },
  apollo: {
    images: {
      query() {
        return this.query
      },
      variables() {
        return {
          id: this.inspectionId
        }
      },
      update(data) {
        return data.eam &&
          data.eam.conditionParameterValues &&
          data.eam.conditionParameterValues.length &&
          data.eam.conditionParameterValues[0].attachments.length
          ? data.eam.conditionParameterValues[0].attachments
          : null
      },
      skip() {
        return !(this.inspectionId)
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
      query: inspectionAttachments,
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
    inspectionId() {
      return parseInt(this.id ? this.id : this.$route.params.inspectionId)
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
