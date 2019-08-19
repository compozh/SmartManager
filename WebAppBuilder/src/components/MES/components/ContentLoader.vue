<template>
    <div class="mes-content-loader">
        <ContentLoader v-if="this.loaderType == 'list'" height=700>
            <rect x="0" y="0" rx="3" ry="3" width="400" height="130" />
            <rect x="0" y="140" rx="3" ry="3" width="400" height="130" />
            <rect x="0" y="280" rx="3" ry="3" width="400" height="130" />
            <rect x="0" y="420" rx="3" ry="3" width="400" height="130" />
            <rect x="0" y="560" rx="3" ry="3" width="400" height="130" />
        </ContentLoader>
        <ContentLoader v-if="this.loaderType != 'list'" height=300>
            <rect x="0" y="0" rx="3" ry="3" width="75" height="40" />
            <rect x="80" y="0" rx="3" ry="3" width="75" height="40" />
            <rect x="160" y="0" rx="3" ry="3" width="75" height="40" />
            <rect x="240" y="0" rx="3" ry="3" width="75" height="40" />
            <rect x="320" y="0" rx="3" ry="3" width="75" height="40" />
            <rect x="400" y="0" rx="3" ry="3" width="75" height="40" />
            <rect x="0" y="50" rx="3" ry="3" width="75" height="40" />
            <rect x="80" y="50" rx="3" ry="3" width="75" height="40" />
            <rect x="160" y="50" rx="3" ry="3" width="75" height="40" />
            <rect x="240" y="50" rx="3" ry="3" width="75" height="40" />
            <rect x="320" y="50" rx="3" ry="3" width="75" height="40" />
            <rect x="400" y="50" rx="3" ry="3" width="75" height="40" />
            <rect x="0" y="100" rx="3" ry="3" width="75" height="40" />
            <rect x="80" y="100" rx="3" ry="3" width="75" height="40" />
            <rect x="160" y="100" rx="3" ry="3" width="75" height="40" />
            <rect x="240" y="100" rx="3" ry="3" width="75" height="40" />
            <rect x="320" y="100" rx="3" ry="3" width="75" height="40" />
            <rect x="400" y="100" rx="3" ry="3" width="75" height="40" />
            <rect x="0" y="150" rx="3" ry="3" width="75" height="40" />
            <rect x="80" y="150" rx="3" ry="3" width="75" height="40" />
            <rect x="160" y="150" rx="3" ry="3" width="75" height="40" />
            <rect x="240" y="150" rx="3" ry="3" width="75" height="40" />
            <rect x="320" y="150" rx="3" ry="3" width="75" height="40" />
            <rect x="400" y="150" rx="3" ry="3" width="75" height="40" />
            <rect x="0" y="200" rx="3" ry="3" width="75" height="40" />
            <rect x="80" y="200" rx="3" ry="3" width="75" height="40" />
            <rect x="160" y="200" rx="3" ry="3" width="75" height="40" />
            <rect x="240" y="200" rx="3" ry="3" width="75" height="40" />
            <rect x="320" y="200" rx="3" ry="3" width="75" height="40" />
            <rect x="400" y="200" rx="3" ry="3" width="75" height="40" />
            <rect x="0" y="250" rx="3" ry="3" width="75" height="40" />
            <rect x="80" y="250" rx="3" ry="3" width="75" height="40" />
            <rect x="160" y="250" rx="3" ry="3" width="75" height="40" />
            <rect x="240" y="250" rx="3" ry="3" width="75" height="40" />
            <rect x="320" y="250" rx="3" ry="3" width="75" height="40" />
            <rect x="400" y="250" rx="3" ry="3" width="75" height="40" />
        </ContentLoader>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {ContentLoader} from 'vue-content-loader'

export default {
  data(){
    return { loaderHeight: 200 }
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
        overflow: hidden;
    }
</style>