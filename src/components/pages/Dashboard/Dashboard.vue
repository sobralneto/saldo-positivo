<template>
  <div class="page" v-cloak>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-0 mb-3 border-bottom">
      <h1 class="h2">Dashboard</h1>
    </div>
    <div class="row">
      <div class="col-5">
        <div class="card shadow-sm">
          <div class="card-header p-2 pl-3">Contas</div>
          <div class="card-body p-1">
            <ul class="list-group list-group-flush p-0" v-if="listaContas.length">
              <li class="list-group-item p-2" v-for="conta in listaContas" :key="conta.IdConta">
                <div class="row">
                  <div class="col-2">
                    <img :src="(conta.ImgConta) ? require(`../../../assets/card_icons/${conta.ImgConta}`) : require('../../../assets/card_icons/carteira.jpg')" class="rounded" style="height: 50px;" />
                  </div>
                  <div class="col-6 d-flex align-items-center pl-0">
                    <div class="col-md-auto pl-0">
                      <p class="m-0" style="font-size: 14px;">{{ conta.Nome }}</p>
                      <small>{{ conta.NomeTipoConta }}</small>
                    </div>
                  </div>
                  <div class="col-4 d-flex align-items-center">
                    <b>{{ conta.SaldoAtual | formataMoeda }}</b>
                  </div>
                </div>
              </li>
            </ul>
            <div class="alert alert-danger" role="alert" v-if="mensagens.erroConta">
              {{ mensagens.erroConta }}
            </div>
          </div><!-- /card-body -->
        </div><!-- /card -->
      </div> <!-- /col-5 -->

      <div class="col-5">
        <div class="card shadow-sm">
          <div class="card-header p-2 pl-3">Cartão de Crédito</div>
          <div class="card-body p-1">
            <ul class="list-group list-group-flush p-0" v-if="listaCartoes.length">
              <li class="list-group-item p-2" v-for="cartao in listaCartoes" :key="cartao.IdCartaoCredito">
                <div class="row">
                  <div class="col-2">
                    <img :src="(cartao.ImgCartao) ? require(`../../../assets/card_icons/${cartao.ImgCartao}`) : require('../../../assets/card_icons/carteira.jpg')" class="rounded" style="height: 50px;" />
                  </div>
                  <div class="col-6 d-flex align-items-center pl-0">
                    <div class="col-md-auto pl-0">
                      <p class="m-0" style="font-size: 14px;">{{ cartao.Nome }}</p>
                      <router-link class="btn btn-outline-secondary btn-sm pt-0 mt-1 pb-0 float-left" :to="{ name: 'CartaoCreditoDetalhe', params: { idCartao: cartao.IdCartaoCredito} }">Fatura</router-link>
                    </div>
                  </div>
                  <div class="col-4 d-flex align-items-center">
                    <b>{{ cartao.ValorFatura | formataMoeda }}</b>
                  </div>
                </div>
              </li>
            </ul>
            <div class="alert alert-danger" role="alert" v-if="mensagens.erroCartao">
              {{ mensagens.erroCartao }}
            </div>
          </div><!-- /card-body -->
        </div><!-- /card -->
      </div> <!-- /col-5 -->
    </div><!-- /row -->
  </div>
</template>

<script>
import axios from 'axios'
import Usuario from '../../../class/usuario'

export default {
  name: 'Dashboard',
  mounted () {
    setTimeout(function () {
      this.carregaDashboard()
    }.bind(this), 1000)
  },
  data () {
    return {
      requestUrl: process.env.VUE_APP_ROOT_API,
      listaCartoes: [],
      listaContas: [],
      mensagens: {
        erroConta: '',
        erroCartao: ''
      }
    }
  },
  methods: {
    carregaDashboard () {
      axios.get(`${this.requestUrl}/dashboard/listarContas`, {
        crossdomain: true,
        headers: {
          Authorization: `Bearer ${Usuario.getToken()}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.listaContas = response.data
          if (!this.listaContas.length) this.mensagens.erroConta = 'Nenhum registro encontrado'
        })
        .catch((error) => {
          this.mensagens.erroConta = error
        })
        .finally()

      axios.get(`${this.requestUrl}/dashboard/listarCartoes`, {
        crossdomain: true,
        headers: {
          'Authorization': `Bearer ${Usuario.getToken()}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.listaCartoes = response.data
          if (!this.listaCartoes.length) this.mensagens.erroCartao = 'Nenhum registro encontrado'
        })
        .catch((error) => {
          this.mensagens.erroCartao = error
        })
        .finally()
    }
  }
}
</script>

<style scoped>

</style>
