import Vue from 'vue'
import App from './App.vue'

import router from './router/index.js'
import store from './store/index.js'
import { sync } from 'vuex-router-sync'

import 'iview/dist/styles/iview.css'
import './common/css/index.scss'

import './common/font/iconfont.css'

import './components/global/index'
import { loadGameInfo } from './util/loadWebSiteConfig'

import VueClipboard from 'vue-clipboard2'
import VueQRCodeComponent from 'vue-qrcode-component'
import VueBus from 'vue-bus';

Vue.use(VueBus);

Vue.component('qr-code', VueQRCodeComponent)

Vue.config.productionTip = false

// 复制文本功能
Vue.use(VueClipboard)

// 路由切换加上loading状态
router.beforeEach(function(to, from, next) {
  store.commit('setPath', {
    from,
    to
  })
  store.commit('setLoadingState', true)
  if (store.state.game.gameInfo.length) {
    next()
  } else {
    loadGameInfo().then(res => {
      store.commit('setGameInfo', res)
      next()
    })
  }
})

router.afterEach(function(to) {
  store.commit('setLoadingState', false)
})

Vue.prototype.$window = window
// 全局事件
Vue.prototype.$eventBus = new Vue()

sync(store, router)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
