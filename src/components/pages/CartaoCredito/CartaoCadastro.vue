<template>
  <div v-cloak>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-0 mb-3 border-bottom">
      <h1 class="h2">Novo cartão</h1>
    </div>
    <div class="row">
      <div class="col-md-3 col-sm-12">
        <label>Nome <font color="red">*</font></label>
        <input type="text" class="form-control" maxlength="200" v-model="nomeCartao" />
      </div>
      <div class="col-md-3 col-sm-12">
        <label>Ícone </label>
        <select class="form-control" v-model="imgCartao">
          <option value="" selected>Selecione</option>
          <option v-for="icon in arrayIcons" :value="icon.img" :key="icon.img">{{ icon.nome }}</option>
        </select>
      </div>
      <div class="col-md-1 col-sm-12 mt-3 pr-0 mr-0" v-if="imgCartao">
        <img :src="require(`../../../assets/card_icons/${imgCartao}`)" class="rounded p-0 m-0" style="height: 50px;" />
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-md-2 col-sm-6">
        <label>Fecha dia <font color="red">*</font></label>
        <input type="number" class="form-control" maxlength="2" min="1" max="31" v-model="fechaDia" />
      </div>
      <div class="col-md-2 col-sm-6">
        <label>Dia vencimento <font color="red">*</font></label>
        <input type="number" class="form-control" maxlength="2" min="1" max="31" v-model="vencimentoDia" />
      </div>
      <div class="col-md-2 col-sm-6">
        <label>Limite</label>
        <input-moeda id-campo="txtLimite" :valor-edicao="parseFloat(0)" v-model="limite"></input-moeda>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 col-sm-12 pt-2">
        <button v-on:click="cadastrarCartaoCredito" class="btn btn-primary">Cadastrar</button>
        <p v-if="mensagens.listaErros.length" class="pt-3">
          <b>{{ mensagens.listaErros.length }} erro(s) encontrado(s) no cadastro:</b>
          <ul>
            <li class="text-danger" v-for="error in mensagens.listaErros" :key="error">{{ error }}</li>
          </ul>
        </p>
        <div class="alert alert-danger" role="alert" v-if="mensagens.msgErro">
          {{ mensagens.msgErro }}
        </div>
        <div class="alert alert-success mt-2" role="alert" v-if="mensagens.msgSucesso">
          {{ mensagens.msgSucesso }}
        </div>
      </div>
    </div>
    <div class="row" v-if="listaCartoes.length">
      <div class="col-md-12 col-sm-12">
        <div class="row">
          <template v-for="cartao in listaCartoes">
            <div class="col-md-4" :key="cartao.IdConta">
              <div class="card mt-3">
                <div class="card-body pb-0">
                  <div class="row">
                    <div class="col-md-3 m-0">
                      <img :src="require(`../../../assets/card_icons/${cartao.ImgCartao}`)" style="height: 70px;">
                    </div>
                    <div class="col-md-9">
                      <b class="font-size-4">{{ cartao.Nome }}</b><br>
                      <small>Fecha: {{ cartao.FechaDia }} | Vence: {{ cartao.VencimentoDia }}</small>
                      <p><b>Limite: </b> {{ cartao.Limite | formataMoeda }}</p>
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
  name: 'CartaoCredito',
  components: {
    'input-moeda': InputMoeda
  },
  created () {
    this.carregaListaCartoes()
  },
  data () {
    return {
      requestUrl: process.env.VUE_APP_ROOT_API,
      nomeCartao: null,
      fechaDia: null,
      vencimentoDia: null,
      limite: null,
      imgCartao: '',
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
      listaCartoes: [],
      mensagens: {
        listaErros: [],
        msgErro: '',
        msgSucesso: ''
      }
    }
  },
  methods: {
    checkFormCadastro () {
      this.mensagens.listaErros = []
      if (!this.nomeCartao) this.mensagens.listaErros.push('Informe o nome do cartão')
      if (!this.fechaDia) this.mensagens.listaErros.push('Informe o dia do fechamento da fatura')
      if (!this.vencimentoDia) this.mensagens.listaErros.push('Informe o dia do vencimento da fatura')
      if (!this.mensagens.listaErros.length) return true
    },
    carregaListaCartoes () {
      axios.get(`${this.requestUrl}/cartaoCredito/listarCartoes`, {
        crossdomain: true,
        headers: {
          Authorization: `Bearer ${Usuario.getToken()}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          this.listaCartoes = response.data
        })
        .catch()
        .finally()
    },
    cadastrarCartaoCredito () {
      this.mensagens.listaErros = []
      this.mensagens.msgErro = ''
      this.msgSucesso = ''

      if (this.checkFormCadastro()) {
        var model = {
          Nome: this.nomeCartao.toString(),
          Bandeira: '',
          FechaDia: parseInt(this.fechaDia),
          VencimentoDia: parseInt(this.vencimentoDia),
          Limite: (this.limite) ? parseFloat(this.limite) : parseFloat(0)
        }

        axios.post(`${this.requestUrl}/cartaoCredito/cadastrar`, model, {
          crossdomain: true,
          headers: {
            Authorization: `Bearer ${Usuario.getToken()}`,
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            this.mensagens.msgSucesso = 'Cadastrado com sucesso'
            this.nomeCartao = null
            this.bandeira = null
            this.fechaDia = null
            this.vencimentoDia = null
            this.limite = null
            setTimeout(function () {
              this.mensagens.msgSucesso = ''
            }.bind(this), 2000)
            this.carregaListaCartoes()
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
