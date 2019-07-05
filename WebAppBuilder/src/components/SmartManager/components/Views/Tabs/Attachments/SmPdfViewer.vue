<template>
  <v-layout column class="pdf-viewer">
    <v-flex class="viewer-toolbar">
      <v-btn outline small class="viewer-btn" @click="back()">
        <v-icon size="18">arrow_drop_up</v-icon>
      </v-btn>
      <v-btn outline small class="viewer-btn" @click="forward()">
        <v-icon size="18">arrow_drop_down</v-icon>
      </v-btn>
      <input type="number" min="1" :max="numPages" @input="input($event)" v-model.number="page">
      <span class="page-count">/</span>
      <input type="number" min="1" v-model.number="numPages" disabled>
      <v-btn outline small class="viewer-btn" @click="rotate += 90">
        <v-icon size="18">rotate_left</v-icon>
      </v-btn>
      <v-btn outline small class="viewer-btn" @click="rotate -= 90">
        <v-icon size="18">rotate_right</v-icon>
      </v-btn>
      <v-btn outline small class="viewer-btn" @click="setWidth(-10)">
        <v-icon size="18">zoom_out</v-icon>
      </v-btn>
      <select class="zoom-options" v-model.number="width">
        <option
          v-for="(i, index) in (maxWidth - minWidth) / 10 + 1"
        >{{ minWidth + index * 10 }}</option>
      </select>
      <span class="page-count">%</span>
      <v-btn outline small class="viewer-btn" @click="setWidth(10)">
        <v-icon size="18">zoom_in</v-icon>
      </v-btn>
    </v-flex>
    <v-flex class="viewer-wrapper">
      <v-layout
        column
        class="mx-2 align-center viewer-page-container"
      >
        <v-flex
          class="my-2 elevation-3 viewer-page-item"
          :style="{ width: width + '% !important'}"
          v-for="i in numPages"
          :key="i"
          :id="'page' + i"
        >
          <pdf
            :src="src"
            :page="i"
            :id="i"
            :rotate="rotate"
          ></pdf>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import pdf from 'vue-pdf'

  export default {
    name: "sm-pdf-viewer",
    props: ['url'],
    components: {
      pdf
    },
    data: () => ({
      scr: '',
      page: 1,
      numPages: 0,
      rotate: 0,
      curPage: 0,
      pageCount: 0,
      sourceText: '',
      width: 100,
      minWidth: 60,
      maxWidth: 160
    }),
    created() {
      this.src = pdf.createLoadingTask(this.url);
      this.src
        .then(pdf => this.numPages = pdf.numPages)
        .catch(e => this.$store.commit('sm/setError', e.message))
    },
    updated() {
      // const isRotate = this.rotate / 90 % 2 ? 2 : 1
      // const threshold = this.width <= 100 ? 0.6 : (0.6 / this.width * 100).toFixed(2)
      // const options = {
      //   root: null,
      //   rootMargin: '0px',
      //   threshold: threshold / isRotate
      // }
      // const callback = (entries, observer) => {
      //   entries.forEach(entry => {
      //     console.log('', entry.intersectionRatio)
      //     if (entry.intersectionRatio > options.threshold
      //       && this.page !== entry.target.id) {
      //       this.page = entry.target.id
      //     }
      //   })
      // }
      // const observer = new IntersectionObserver(callback, options)
      // for (let i = 1; i <= this.numPages; i++) {
      //   let elem = document.getElementById(i)
      //   observer.observe(elem);
      // }
      // window.onscroll = function () {
      //   console.log('window.onscroll', )
      // }
      // for (let i = 1; i <= this.numPages; i++) {
      //   let elem = document.getElementById('page' + i)
      //   elem.addEventListener('onscroll', function () {
      //     console.log('scroll', )
      //   })
      //   elem.addEventListener('scroll', function () {
      //     console.log('scroll', )
      //   })
      //   elem.onscroll = function () {
      //     console.log('elem.onscroll', )
      //   }
      //   elem.addEventListener('click', event => {
      //
      //     console.log('offsetTop - ', event.currentTarget.offsetTop)
      //     console.log('scrollTop - ', event.currentTarget.scrollTop)
      //     console.log('scrollLeft - ', event.currentTarget.scrollLeft)
      //
      //   })
      // }
    },
    methods: {
      switchPage(id) {
        document.getElementById(id).scrollIntoView()
      },
      back() {
        if (this.page > 1) {
          this.switchPage(--this.page)
        }
      },
      forward() {
        if (this.page < this.numPages) {
          this.switchPage(++this.page)
        }
      },
      input(event) {
        const inputPage = event.target.value
        if (inputPage >= 1 && inputPage <= this.numPages) {
          this.switchPage(inputPage)
        }
      },
      setWidth(step) {
        if (step < 0 && this.width > this.minWidth
            || step > 0 && this.width < this.maxWidth) {
          this.width += step
        }
      }
    }
  }
</script>

<style scoped>

  .pdf-viewer {
    background: #f5f5f5;
    border: 1px solid #c6c6c6;
    border-radius: 2px;
  }

  .pdf-viewer, .viewer-wrapper {
    height: inherit;
  }

  .viewer-wrapper {
    overflow: auto;
  }

  .viewer-toolbar {
    background: #efefef;
    border-bottom: 1px solid #c6c6c6;
  }

  .viewer-page-container {

  }

  .viewer-page-item {
    max-width: none !important;
  }

  input[type=number], .zoom-options {
    border: 1px solid #c6c6c6;
    border-radius: 2px;
    text-align: center;
    text-align-last: center;
    outline:none;
    font-size: 12px;
    width: 30px;
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  .page-count {
    color: rgb(102, 102, 102);
    font-size: 14px;
    font-weight: 300;
  }

  .v-btn.viewer-btn, input[type=number], .zoom-options {
    padding: 0;
    margin: 4px 7px;
    text-transform: none;
    font-weight: 300;
    color: #666;
    background-color: #f5f5f5 !important;
    border-color: #c6c6c6;
    height: 20px;
    min-width: 30px;
  }

  ::-webkit-scrollbar {
    display: none;
  }

</style>