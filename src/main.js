import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'

import money from 'v-money'

Vue.config.productionTip = false

Vue.filter('formataMoeda', (value) => {
  return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
})

Vue.use(money, {precision: 2})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
