<template>
  <div v-cloak>
    <div class="row">
      <div class="col-6">
        <div class="card pb-0">
          <div class="card-body pb-0">
            <h5 class="card-title">Minhas contas<small class="float-right pb-0 mb-0">Saldo atual</small></h5>          
            <table class="table" v-if="listaContas.length">
              <tbody>
                <tr v-for="conta in listaContas" :key="conta.IdConta">
                  <td><img :src="require(`../assets/card_icons/${conta.ImgConta}`)" class="rounded" height="40" /></td>
                  <td style="vertical-align: middle;">
                      <p class="m-0 p-0">{{ conta.Nome }}</p>
                      <small class="text-secondary">{{ conta.NomeTipoConta }}</small>
                  </td>
                  <td style="vertical-align: middle;"><b class="float-right">{{ conta.SaldoAtual | formataMoeda }}</b></td>
                </tr>
              </tbody>
            </table>
            <div class="alert alert-danger" role="alert" v-if="!listaContas.length">
              {{ mensagens.erroConta }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card pb-0">
          <div class="card-body pb-0">
            <h5 class="card-title">Meus Cartões</h5>
            <table class="table" v-if="listaCartoes.length">
              <tbody>
                <tr v-for="cartao in listaCartoes" :key="cartao.IdCartaoCredito">
                  <td><img :src="require(`../assets/card_icons/${cartao.ImgCartao}`)" class="rounded" height="40" /></td>
                  <td style="vertical-align: middle;">
                      {{ cartao.Nome }}
                      <router-link class="btn btn-outline-secondary btn-sm pt-0 pb-0 float-right ml-2" :to="{ name: 'CartaoCreditoDetalhe', params: { idCartao: cartao.IdCartaoCredito} }">Fatura</router-link>
                  </td>
                  <td style="vertical-align: middle;"><b class="float-right">{{ cartao.ValorFatura | formataMoeda }}</b></td>
                </tr>
              </tbody>
            </table>
            <div class="alert alert-danger" role="alert" v-if="!listaCartoes.length">
              {{ mensagens.erroCartao }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Dashboard',
  created () {
    this.carregaDashboard()
  },
  data () {
    return {
      logo: require('../assets/card_icons/nuconta.jpg'),
      listaCartoes: [],
      listaContas: [],
      mensagens: {
        erroConta: '',
        erroCartao: '',
      },
    }
  },
  methods: {
    carregaDashboard () {      
      axios.post('http://localhost:53417/api/dashboard/listarContas')
        .then((response) => {
          this.listaContas = response.data;
        })
        .catch((error) => {
          this.mensagens.erroConta = 'Erro ao listar contas';
        })
        .finally()

      axios.post('http://localhost:53417/api/dashboard/listarCartoes')
        .then((response) => {
          this.listaCartoes = response.data;
        })
        .catch((error) => {
          this.mensagens.erroCartao = 'Erro ao listar cartões';
        })
        .finally()      
    }
  }
}
</script>

<style scoped>

</style>
