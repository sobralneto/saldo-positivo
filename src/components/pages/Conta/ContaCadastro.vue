<template>
  <div v-cloak>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-0 mb-3 border-bottom">
      <h1 class="h2">Nova conta</h1>
    </div>
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
      <div class="col-md-1 col-sm-12 mt-3 pr-0 mr-0" v-if="imgConta">
        <img :src="require(`../../../assets/card_icons/${imgConta}`)" class="rounded p-0 m-0" style="height: 50px;" />
      </div>
      <div class="col-md-3 col-sm-12">
        <label>Ícone </label>
        <select class="form-control" v-model="imgConta">
          <option value="" selected>Selecione</option>
          <option v-for="icon in arrayIcons" :value="icon.img" :key="icon.img">{{ icon.nome }}</option>
        </select>
      </div>
      <div class="col-md-2 col-sm-12">
        <label>Saldo Inicial <font color="red">*</font></label>
        <input-moeda id-campo="txtSaldoInicial" :valor-edicao="parseFloat(0)" v-model="saldoInicial"></input-moeda>
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
        <div class="alert alert-success mt-2" role="alert" v-show="mensagens.msgSucesso">
          {{ mensagens.msgSucesso }}
        </div>
      </div>
    </div>
    <div class="row" v-if="listaContas.length">
      <div class="col-md-12 col-sm-12">
        <div class="row">
          <template v-for="conta in listaContas">
            <div class="col-md-4" :key="conta.IdConta">
              <div class="card mt-3">
                <div class="card-body pb-0">
                  <div class="row">
                    <div class="col-md-3 m-0">
                      <img :src="require(`../../../assets/card_icons/${conta.ImgConta}`)" style="height: 70px;">
                    </div>
                    <div class="col-md-9">
                      <b class="font-size-4">{{ conta.Nome }}</b><br>
                      <small>{{ conta.NomeTipoConta }}</small><br>
                      <p><b>Saldo Inicial: </b> {{ conta.SaldoInicial | formataMoeda }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputMoeda from '../../utilitarios/InputMoeda'
import axios from 'axios'
import Usuario from '../../../class/usuario'

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
      saldoInicial: parseFloat(0),
      imgConta: '',
      arrayIcons: [
        {nome: 'Bradesco', img: 'bradesco.jpg'},
        {nome: 'Caixa Econômica', img: 'caixa.jpg'},
        {nome: 'Carteira', img: 'carteira.jpg'},
        {nome: 'Itaú', img: 'itau.jpg'},
        {nome: 'Mastercard', img: 'mastercard.png'},
        {nome: 'Neon', img: 'neon.jpg'},
        {nome: 'Next', img: 'next.jpg'},
        {nome: 'Nubank', img: 'nuconta.jpg'},
        {nome: 'Rico', img: 'rico.jpg'},
        {nome: 'Visa', img: 'visa.jpg'}
      ],
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
      axios.get(`${this.requestUrl}/conta/listarTipoConta`, {
        crossdomain: true,
        headers: {
          Authorization: `Bearer ${Usuario.getToken()}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.listaTipoConta = response.data
        })
        .catch()
        .finally()
    },
    listarContas () {
      axios.get(`${this.requestUrl}/conta/listarContas`, {
        crossdomain: true,
        headers: {
          Authorization: `Bearer ${Usuario.getToken()}`,
          'Content-Type': 'application/json'
        }
      })
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
          SaldoInicial: parseFloat(this.saldoInicial),
          ImgConta: this.imgConta.toString()
        }

        axios.post(`${this.requestUrl}/conta/cadastrar`, model, {
          crossdomain: true,
          headers: {
            Authorization: `Bearer ${Usuario.getToken()}`,
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            this.mensagens.msgSucesso = 'Cadastrado com sucesso'
            this.idTipoConta = 0
            this.nomeConta = ''
            this.saldoInicial = parseFloat(0)
            this.imgConta = ''
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
