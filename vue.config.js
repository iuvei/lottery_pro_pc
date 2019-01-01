module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/common/css/themeEnter.scss";
        `
      },
      less: {
          javascriptEnabled: true
      }
    }
  }
}
