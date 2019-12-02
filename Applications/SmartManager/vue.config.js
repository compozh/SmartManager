const path = require('path')
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('graphql')
      .test(/\.(graphql|gql)$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end()
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_BASE_PATH + path.basename(process.cwd(), path.extname(process.cwd()))
    : '/',
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
  configureWebpack: {
    devtool: 'eval-source-map'
  },
  pwa: {
    name: 'Smart Manager',
    short_name: 'Smart Manager',
    themeColor: '#7367F0',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js'
    }
  }
}
