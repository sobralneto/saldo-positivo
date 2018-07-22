import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'

import Login from '@/components/pages/Login/Login'
import Dashboard from '@/components/pages/Dashboard/Dashboard'
import Conta from '@/components/pages/Conta/ContaCadastro'
import CartaoCredito from '@/components/pages/CartaoCredito/CartaoCadastro'
import CartaoCreditoDetalhe from '@/components/pages/CartaoCredito/CartaoDetalhamento'
import Categoria from '@/components/pages/Categoria/CategoriaCadastro'
import LancamentoCadastro from '@/components/pages/Lancamento/LancamentoCadastro'
import LancamentoConsulta from '@/components/pages/Lancamento/LancamentoConsulta'
import Relatorio from '@/components/pages/Relatorio/Relatorio'

import '../assets/css/main.css'
import 'popper.js'
import 'jquery/dist/jquery.slim'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import firebase from 'firebase'
import Usuario from '../class/usuario'

Vue.use(Router)

let router = new Router({
  // mode: 'history',
  routes: [
    { path: '*', redirect: '/Login' },
    { path: '/', redirect: '/Login' },
    { path: '/Login', name: 'Login', component: Login },
    { path: '/Dashboard', name: 'Dashboard', component: Dashboard, meta: {requiresAuth: true} },
    { path: '/Conta', name: 'Conta', component: Conta, meta: {requiresAuth: true} },
    { path: '/Categoria', name: 'Categoria', component: Categoria, meta: {requiresAuth: true} },
    { path: '/CartaoCredito', name: 'CartaoCredito', component: CartaoCredito, meta: {requiresAuth: true} },
    { path: '/CartaoDetalhe/:idCartao', name: 'CartaoCreditoDetalhe', component: CartaoCreditoDetalhe, meta: {requiresAuth: true} },
    { path: '/Lancamento/:tipo', name: 'Lancamento', component: LancamentoCadastro, meta: {requiresAuth: true} },
    { path: '/LancamentoConsulta', name: 'LancamentoConsulta', component: LancamentoConsulta, meta: {requiresAuth: true} },
    { path: '/Relatorio', name: 'Relatorio', component: Relatorio, meta: {requiresAuth: true} }
  ]
})

router.beforeEach((to, from, next) => {
  if (!Usuario.getLogado()) {
    firebase.auth().signOut().then(() => {
      store.commit('SET_VERIFICA_LOGIN')
      Usuario.setLogado(false)
      next('Login')
    })
  }

  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('Login')
  else if (!requiresAuth && currentUser) next('Dashboard')
  else next()
})

export default router
