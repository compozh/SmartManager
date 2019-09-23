<template>
  <v-layout column wrap>
    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
      <h3>Перетащите файлы для добавления</h3>
    </div>

    <v-container fluid grid-list-md pa-0 pb-3>
      <v-layout row wrap>
        <template v-for="(file,i) in files">
          <v-card :key="i" height="120" width="120" class="ma-1">
            <v-card-title class="pa-1">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <span v-on="on" class="caption file-title">{{ file.name }}</span>
                </template>
                <span>{{ file.name }}</span>
              </v-tooltip>
            </v-card-title>
            <v-alert v-if="file.error">{{file.error}}</v-alert>
            <v-img
              v-else-if="imageFormats.includes(file.name.split('.').pop())"
              contain
              max-height="80"
              :src="file.url"
            ></v-img>
            <div v-else class="file-icon">
              <v-icon color="blue" size="65">insert_drive_file</v-icon>
              <span class="icon-extension">{{ file.name.split('.').pop() }}</span>
            </div>

            <v-card-actions>
              <v-btn
                small
                icon
                @click.prevent="$refs.upload.remove(file)"
                class="pa-0 align-to-bottom-left"
              >
                <v-icon color="red">close</v-icon>
              </v-btn>
              <span class="pa-0 align-to-bottom-right">{{Math.round(file.size/1000)}} кБ</span>
            </v-card-actions>
          </v-card>
        </template>
        <v-flex xs12 sm4>
          <file-upload
            extensions="gif,jpg,jpeg,png,webp"
            accept="image/png, image/gif, image/jpeg, image/webp"
            class="v-btn v-btn--block theme--light"
            :post-action="postPath"
            :multiple="true"
            :drop="true"
            :drop-directory="true"
            @input-filter="inputFilter"
            v-model="files"
            ref="upload"
          >
            <div class="v-btn__content">
              <v-icon dark>attach_file</v-icon>Выбрать файлы
            </div>
          </file-upload>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import FileUpload from 'vue-upload-component'

export default {
  name: 'eam-add-attachment-control',

  components: {
    FileUpload
  },

  props: {
    item: Object,
    action: String,
    updateCache: Object,
    query: Object,
    variables: Object,
    attachmentType: String
  },

  data: () => {
    return {
      imageFormats: ['jpg', 'jpeg', 'png'],
      files: []
    }
  },

  computed: {
    loading() {
      return this.$store.getters['eam/loading']
    },
    uploaded() {
      return this.files.every(f => f.response && typeof f.response === 'string')
    },
    postPath() {
      return `${myConfig.WsPath}AddFile.ashx`
    }
  },

  watch: {
    uploaded(value) {
      if (this.files && this.files.length && value) {
        const fileNames = this.files.map(f => f.name)
        const filePaths = this.files.map(f => f.response)
        const variablesValues = {
          ...this.variables,
          fileNames,
          filePaths,
          attachmentType: this.attachmentType
        }
        this.$apollo
          .mutate({
            mutation: this.query,
            variables: variablesValues
          })
          .then(data => {
            this.$refs.upload.clear()
            this.$store.commit('eam/setLoading', false)
            this.$emit('filesUploaded', data.data)
          })
          .catch(e => this.$store.commit('eam/setError', e.message))
      }
    }
  },

  methods: {
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        if (/\.(php5?|html?|js?)$/i.test(newFile.name)) {
          return prevent()
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file)
        }
      }
    },
    upload() {
      if (this.$refs.upload.files.length) {
        this.$refs.upload.active = true
        this.$store.commit('eam/setLoading', true)
      }
    }
  }
}
</script>

<style scoped>
.align-to-bottom-left {
  position: absolute;
  bottom: 0;
  left: 0;
}

.align-to-bottom-right {
  position: absolute;
  bottom: 0;
  right: 0;
}

.file-icon {
  position: relative;
  width: min-content;
}

.icon-extension {
  position: absolute;
  bottom: 1px;
  right: 5px;
  font-size: 15px;
  text-shadow: 1px 1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff,
    -1px -1px 0 #fff;
}

.file-title {
  width: 100%;
  max-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: 0.6;
  text-align: center;
  background: #000;
}

.drop-active h3 {
  margin: -0.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
.file-uploads {
  display: flex;
  max-width: 200px;
}
</style>