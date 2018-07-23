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
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SEND_ID'
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
