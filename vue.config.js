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
      locale: 'uk',
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
  pages: {
    index: {
      entry: 'src/main.js'
    },
    callback: {
      entry: 'src/oidc/callback.js',
      template: 'public/index.html',
      filename: 'callback.html'
    },
    callbacksignout: {
      entry: 'src/oidc/callbacksignout.js',
      template: 'public/index.html',
      filename: 'callbacksignout.html'
    },
    callbacksilent: {
      entry: 'src/oidc/callbacksilent.js',
      template: 'public/index.html',
      filename: 'callbacksilent.html'
    }
  }
}
