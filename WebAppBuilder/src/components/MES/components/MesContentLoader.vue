<template>
    <div class="mes-content-loader">
        <ContentLoader v-if="this.loaderType == 'list'">
            <rect x="0" y="0" rx="3" ry="3" width="400" height="10" />
            <rect x="20" y="20" rx="3" ry="3" width="220" height="10" />
            <rect x="20" y="40" rx="3" ry="3" width="170" height="10" />
            <rect x="0" y="60" rx="3" ry="3" width="400" height="10" />
            <rect x="20" y="80" rx="3" ry="3" width="200" height="10" />
            <rect x="20" y="100" rx="3" ry="3" width="350" height="10" />
        </ContentLoader>
        <ContentLoader v-if="this.loaderType != 'list'" :height="this.loaderHeight">
            <rect x="0" y="0" rx="3" ry="3" width="75" height="75" />
            <rect x="80" y="0" rx="3" ry="3" width="75" height="75" />
            <rect x="160" y="0" rx="3" ry="3" width="75" height="75" />
            <rect x="240" y="0" rx="3" ry="3" width="75" height="75" />
            <rect x="320" y="0" rx="3" ry="3" width="75" height="75" />
            <rect x="400" y="0" rx="3" ry="3" width="75" height="75" />
            <rect x="0" y="80" rx="3" ry="3" width="75" height="75" />
            <rect x="80" y="80" rx="3" ry="3" width="75" height="75" />
            <rect x="160" y="80" rx="3" ry="3" width="75" height="75" />
            <rect x="240" y="80" rx="3" ry="3" width="75" height="75" />
            <rect x="320" y="80" rx="3" ry="3" width="75" height="75" />
            <rect x="400" y="80" rx="3" ry="3" width="75" height="75" />
        </ContentLoader>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {ContentLoader} from 'vue-content-loader'

export default {
  data(){
    return { loaderHeight: 180 }
  },
  name: "mes-content-loader",
  components: {
    ContentLoader
  },
  props: {
    loaderType: String
  }
}
</script>

<style type="text/css" scoped>
    .mes-content-loader {
        padding: 20px;
    }
</style>