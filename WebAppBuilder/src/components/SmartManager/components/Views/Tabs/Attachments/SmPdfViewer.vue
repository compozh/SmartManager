<template>
  <v-layout column class="pdf-viewer">
    <v-flex class="viewer-toolbar">
      <!-- Кнопка на страницу назад-->
      <v-btn
        outline small
        class="viewer-btn"
        @click="back"
        :disabled="+page === 1"
      >
        <v-icon size="18">arrow_drop_up</v-icon>
      </v-btn>
      <!-- Кнопка на страницу вперед-->
      <v-btn
        outline small
        class="viewer-btn"
        @click="forward"
        :disabled="+page === numPages"
      >
        <v-icon size="18">arrow_drop_down</v-icon>
      </v-btn>
      <!-- Поле отображения/ввода текущей страницы -->
      <input
        type="number"
        min="1"
        :max="numPages"
        @input="input($event)"
        v-model.number="page"
      >
      <span class="page-count">/</span>
      <!-- Поле отображения количества страниц -->
      <input
        type="number"
        v-model="numPages"
        disabled
      >
      <!-- Кнопка поворота на 90 градусов против часовой стрелки -->
      <v-btn
        outline small
        class="viewer-btn"
        @click="rotate += 90"
      >
        <v-icon size="18">rotate_left</v-icon>
      </v-btn>
      <!-- Кнопка поворота на 90 градусов по часовой стрелке -->
      <v-btn
        outline small
        class="viewer-btn"
        @click="rotate -= 90"
      >
        <v-icon size="18">rotate_right</v-icon>
      </v-btn>
      <!-- Кнопка уменьшения масштаба на 10% -->
      <v-btn
        outline small
        class="viewer-btn"
        @click="setWidth(-10)"
      >
        <v-icon size="18">zoom_out</v-icon>
      </v-btn>
      <!-- Поле отображения масштаба с возможностью выбора из выпадающего списка-->
      <select
        class="zoom-options"
        v-model.number="width"
      >
        <option
          v-for="(i, index) in (maxWidth - minWidth) / 10 + 1"
        >
          {{ minWidth + index * 10 }}
        </option>
      </select>
      <span class="page-count">%</span>
      <!-- Кнопка увеличения масштаба на 10% -->
      <v-btn
        outline small
        class="viewer-btn"
        @click="setWidth(10)"
      >
        <v-icon size="18">zoom_in</v-icon>
      </v-btn>
      <!-- Кнопка маштабирования по ширине страницы -->
      <v-btn
        outline small
        class="viewer-btn"
        @click="width = 100"
      >
        <v-icon size="18">panorama_horizontal</v-icon>
      </v-btn>
      <!-- Кнопка маштабирования по высоте страницы !!!НЕ РЕАЛИЗОВАНО -->
      <v-btn
        outline small
        class="viewer-btn"
        @click=""
      >
        <v-icon size="18">panorama_vertical</v-icon>
      </v-btn>
      <!-- Кнопка включения/выключения полноэкранного режима -->
      <v-btn
        outline small
        class="viewer-btn"
        @click="toggleFullScreen"
      >
        <v-icon size="18">open_with</v-icon>
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
            @page-loaded="observePages($event)"
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
      width: 100,
      minWidth: 60,
      maxWidth: 160
    }),
    created() {
      this.src = pdf.createLoadingTask(this.url);
      this.src
        .then(pdf => this.numPages = pdf.numPages)
        .catch(e => {
          this.$store.commit('sm/setMessage', { type: 'error', text: e.message })
        })
    },
    methods: {
      observePages(event) {
        if (this.numPages === event) {
          const callback = (entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting && this.page !== entry.target.id) {
                this.page = entry.target.id
              }
            })
          }
          const observer = new IntersectionObserver(callback, {threshold: 0.3})
          for (let i = 1; i <= this.numPages; i++) {
            let elem = document.getElementById(i)
            observer.observe(elem);
          }
        }
      },
      toggleFullScreen() {
        const elem = document.querySelector('.pdf-viewer')
        if (!document.fullscreenElement) {
          elem.requestFullscreen()
        } else {
          document.exitFullscreen()
        }
      },
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

  .viewer-toolbar {
    background: #efefef;
    border-bottom: 1px solid #c6c6c6;
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

  .viewer-wrapper {
    overflow: auto;
  }

  .viewer-wrapper::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  .viewer-wrapper::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  .viewer-wrapper::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
  }

</style>