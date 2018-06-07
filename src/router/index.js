import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from '@/components/Dashboard'
import Conta from '@/components/Conta'
import CartaoCredito from '@/components/CartaoCredito'
import CartaoCreditoDetalhe from '@/components/CartaoCreditoDetalhe'
import Categoria from '@/components/Categoria'
import Lancamento from '@/components/Lancamento'
import LancamentoConsulta from '@/components/LancamentoConsulta'
import Relatorio from '@/components/Relatorio'

import 'bootstrap/dist/css/bootstrap.css'
import 'popper.js'
import 'jquery/dist/jquery.slim'
import 'bootstrap'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/Dashboard' },
    { path: '/Dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/Conta', name: 'Conta', component: Conta },
    { path: '/Categoria', name: 'Categoria', component: Categoria },
    { path: '/CartaoCredito', name: 'CartaoCredito', component: CartaoCredito },
    { path: '/CartaoDetalhe/:idCartao', name: 'CartaoCreditoDetalhe', component: CartaoCreditoDetalhe },
    { path: '/Lancamento/:tipo', name: 'Lancamento', component: Lancamento },
    { path: '/LancamentoConsulta', name: 'LancamentoConsulta', component: LancamentoConsulta },
    { path: '/Relatorio', name: 'Relatorio', component: Relatorio }
  ]
})
