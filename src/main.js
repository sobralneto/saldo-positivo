import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import firebase from 'firebase'
import BootstrapVue from 'bootstrap-vue'
import money from 'v-money'

Vue.config.productionTip = false

Vue.filter('formataMoeda', (value) => {
  return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
})

Vue.use(money, {precision: 2})
Vue.use(BootstrapVue)

let app
var config = {
  apiKey: 'AIzaSyAZwhdf8WwvhGBq9dcpLHlmMXnqde4iHQY',
  authDomain: 'saldo-positivo.firebaseapp.com',
  databaseURL: 'https://saldo-positivo.firebaseio.com',
  projectId: 'saldo-positivo',
  storageBucket: 'saldo-positivo.appspot.com',
  messagingSenderId: '6047805400'
}

firebase.initializeApp(config)
firebase.auth().onAuthStateChanged((user) => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      render: h => h(App),
      store
    })
  }
})
