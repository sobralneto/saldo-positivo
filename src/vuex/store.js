import myLib from '../funcoes/myLib'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    filtroConsulta: {
      idContaCartao: null,
      mesVigenteInt: myLib.returnDate('monthId'),
      anoVigente: myLib.returnDate('year')
    },
    verificaLogin: new Date()
  },
  mutations: {
    SET_FILTRO_CONSULTA (store, obj) {
      store.filtroConsulta = obj
    },
    SET_VERIFICA_LOGIN (store) {
      store.verificaLogin = new Date()
    }
  }
})
