<template>
  <div v-cloak>
    <div class="row">
      <div class="col-md-3 col-sm-12">
        <label>Tipo de conta <font color="red">*</font></label>
        <select class="form-control" v-model="idTipoConta">
            <option value="0" selected>Selecione</option>
            <option v-for="tc in listaTipoConta" :key="tc.IdTipoConta" :value="tc.IdTipoConta">{{ tc.Nome }}</option>
        </select>
      </div>
      <div class="col-md-3 col-sm-12">
        <label>Nome <font color="red">*</font></label>
        <input type="text" class="form-control" maxlength="200" v-model="nomeConta" />
      </div>
      <div class="col-md-3 col-sm-12">
        <label>Saldo Inicial <font color="red">*</font></label>
        <input-moeda id-campo="txtSaldoInicial" :valor-lancamento="saldoInicial" v-model="saldoInicial"></input-moeda>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 col-sm-12 pt-2">
        <button v-on:click="cadastrarConta" class="btn btn-primary">Cadastrar</button>
        <p v-if="mensagens.listaErros.length" class="pt-3">
          <b>{{ mensagens.listaErros.length }} erro(s) encontrado(s) no cadastro:</b>
          <ul>
            <li class="text-danger" v-for="error in mensagens.listaErros" :key="error">{{ error }}</li>
          </ul>
        </p>
        <div class="alert alert-danger" role="alert" v-show="mensagens.msgErro">
          {{ mensagens.msgErro }}
        </div>
        <div class="alert alert-success" role="alert" v-show="mensagens.msgSucesso">
          {{ mensagens.msgSucesso }}
        </div>
      </div>
    </div>
    <div class="row" v-if="listaContas.length">
      <div class="col-md-6 col-sm-12 pt-2">
        <table class="table table-hover table-striped table-sm">
          <caption>{{ listaContas.length }} conta(s) cadastrada(s)</caption>
          <thead class="bg-primary text-white">
            <tr>
              <th><center>Tipo Conta</center></th>
              <th><center>Conta</center></th>
              <th><center>Saldo Inicial</center></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="conta in listaContas" :key="conta.IdConta">
              <td>{{ conta.NomeTipoConta }}</td>
              <td>{{ conta.Nome }}</td>
              <td>{{ conta.SaldoInicial | formataMoeda }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import InputMoeda from './inputs/InputMoeda'
import axios from 'axios'

export default {
  name: 'Conta',
  components: {
    'input-moeda': InputMoeda
  },
  created () {
    this.listarTipoConta()
    this.listarContas()
  },
  data () {
    return {
      requestUrl: process.env.VUE_APP_ROOT_API,
      idTipoConta: 0,
      nomeConta: null,
      saldoInicial: null,
      listaTipoConta: [],
      listaContas: [],
      mensagens: {
        listaErros: [],
        msgErro: '',
        msgSucesso: ''
      }
    }
  },
  methods: {
    listarTipoConta () {
      axios.post(`${this.requestUrl}/conta/listarTipoConta`)
        .then((response) => {
          this.listaTipoConta = response.data
        })
        .catch()
        .finally()
    },
    listarContas () {
      axios.post(`${this.requestUrl}/conta/listarContas`)
        .then((response) => {
          this.listaContas = response.data
        })
        .catch()
        .finally()
    },
    checkFormCadastro () {
      this.mensagens.listaErros = []
      if (!this.idTipoConta) this.mensagens.listaErros.push('Informe o tipo da conta')
      if (!this.nomeConta) this.mensagens.listaErros.push('Informe o nome')
      if (!this.saldoInicial) this.mensagens.listaErros.push('Informe o saldo inicial da conta')

      if (!this.mensagens.listaErros.length) return true
    },
    cadastrarConta () {
      this.mensagens.listaErros = []
      this.mensagens.msgErro = ''
      this.mensagens.msgSucesso = ''

      if (this.checkFormCadastro()) {
        var model = {
          IdTipoConta: parseInt(this.idTipoConta),
          Nome: this.nomeConta.toString(),
          SaldoInicial: parseFloat(this.saldoInicial)
        }

        axios.post(`${this.requestUrl}/conta/cadastrar`, model, {
          headers: { 'Content-Type': 'application/json' }
        })
          .then((response) => {
            this.mensagens.msgSucesso = 'Cadastrado com sucesso'
            this.idTipoConta = 0
            this.nomeConta = ''
            this.saldoInicial = null
            setTimeout(function () {
              this.mensagens.msgSucesso = ''
            }.bind(this), 2000)
            this.listarContas()
          })
          .catch((error) => {
            this.mensagens.msgErro = error
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
