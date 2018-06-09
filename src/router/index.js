import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from '@/components/pages/Dashboard/Dashboard'
import Conta from '@/components/pages/Conta/ContaCadastro'
import CartaoCredito from '@/components/pages/CartaoCredito/CartaoCadastro'
import CartaoCreditoDetalhe from '@/components/pages/CartaoCredito/CartaoDetalhamento'
import Categoria from '@/components/pages/Categoria/CategoriaCadastro'
import LancamentoCadastro from '@/components/pages/Lancamento/LancamentoCadastro'
import LancamentoConsulta from '@/components/pages/Lancamento/LancamentoConsulta'
import Relatorio from '@/components/pages/Relatorio/Relatorio'

import 'bootstrap/dist/css/bootstrap.css'
import 'popper.js'
import 'jquery/dist/jquery.slim'
import 'bootstrap'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '*', name: 'error404' },
    { path: '/', redirect: '/Dashboard' },
    { path: '/Dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/Conta', name: 'Conta', component: Conta },
    { path: '/Categoria', name: 'Categoria', component: Categoria },
    { path: '/CartaoCredito', name: 'CartaoCredito', component: CartaoCredito },
    { path: '/CartaoDetalhe/:idCartao', name: 'CartaoCreditoDetalhe', component: CartaoCreditoDetalhe },
    { path: '/Lancamento/:tipo', name: 'Lancamento', component: LancamentoCadastro },
    { path: '/LancamentoConsulta', name: 'LancamentoConsulta', component: LancamentoConsulta },
    { path: '/Relatorio', name: 'Relatorio', component: Relatorio }
  ]
})
