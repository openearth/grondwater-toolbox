module.exports = {
  transpileDependencies: [ 'vuetify' ],
  chainWebpack: (config) => {
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use('html-loader')
      .loader('html-loader')
      .end()
      .use('markdown-loader')
      .loader('markdown-loader')
      .end();
  },
  configureWebpack:(config) => {
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'cheap-module-source-map';
    }
  },
};
