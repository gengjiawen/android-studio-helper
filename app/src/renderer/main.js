import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Router from 'vue-router'
import Rx from 'rxjs/Rx'
import VueRx from 'vue-rx'
import App from './App'
import routes from './routes'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

// tada!
Vue.use(Electron)
Vue.use(Resource)
Vue.use(Router)
Vue.use(ElementUI)
Vue.use(VueRx, Rx)
Vue.config.debug = true

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  ...App
}).$mount('#app')
