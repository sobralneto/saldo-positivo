import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
	},
	{
		path: '/charts',
		name: 'Charts',
		component: () => import(/* webpackChunkName: "about" */ '../views/Charts.vue'),
	},
];

const router = new VueRouter({
	routes,
	mode: 'history',
	linkExactActiveClass: 'fw-bold text-success',
});

export default router;
