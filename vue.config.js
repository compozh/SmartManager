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
  publicPath: process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_BASE_PATH + (process.env.VUE_APP_DOCKERMODE ? '' : 'SmartManager')
    : '/',
  transpileDependencies: [
    'resize-detector'
  ],
  configureWebpack: {
    devtool: 'eval-source-map'
  },
  pwa: {
    name: 'Smart Manager',
    short_name: 'Smart Manager',
    themeColor: '#42A5F6',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js'
    }
  }
}
