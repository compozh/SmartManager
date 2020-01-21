const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const path = require('path')
module.exports = {
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin()
    ]
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader');

    config.module
      .rule('graphql')
      .test(/\.(graphql|gql)$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end();
    
    config.module
      .rule('dmn')
      .test(/\.dmn$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();

  },
  publicPath: process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_BASE_PATH + path.basename(process.cwd(), path.extname(process.cwd()))
    : '/',
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: true
    }
  }
}
