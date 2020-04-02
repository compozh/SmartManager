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
    },
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'i18n',
      enableInSFC: true
    }
  },
  transpileDependencies: [
    'resize-detector'
  ],
  configureWebpack: {
    devtool: 'eval-source-map'
  },
  pwa: {
    name: 'Smart Manager',
    short_name: 'Smart Manager',
    themeColor: '#5F81FF',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js'
    }
  }
}
