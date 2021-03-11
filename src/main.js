import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './styles/custom-bootstrap.scss';
//import 'bootstrap';
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
