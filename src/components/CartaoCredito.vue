<template>
  <div v-cloak>
    <div class="row">
      <div class="col-md-3 col-sm-12">
        <label>Nome <font color="red">*</font></label>
        <input type="text" class="form-control" maxlength="200" v-model="nomeCartao" />
      </div>
      <div class="col-md-2 col-sm-6">
        <label>Bandeira</label>
        <input type="text" class="form-control" maxlength="200" v-model="bandeira" />
      </div>
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
        <div class="alert alert-success" role="alert" v-if="mensagens.msgSucesso">
          {{ mensagens.msgSucesso }}
        </div>
      </div>
    </div>
    <div class="row" v-if="listaCartoes.length">
      <div class="col-md-7 col-sm-12 pt-2">
        <table class="table table-hover table-striped table-sm">
          <caption>{{ listaCartoes.length }} cartões cadastrados</caption>
          <thead class="bg-primary text-white">
            <tr>
              <th><center>Nome</center></th>
              <th><center>Bandeira</center></th>
              <th><center>Fecha Dia</center></th>
              <th><center>Dia Vencimento</center></th>
              <th><center>Limite</center></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cartao in listaCartoes" :key="cartao.IdCartaoCredito">
              <td>{{ cartao.Nome }}</td>
              <td>{{ cartao.Bandeira }}</td>
              <td>{{ cartao.FechaDia }}</td>
              <td>{{ cartao.VencimentoDia }}</td>
              <td>{{ cartao.Limite | formataMoeda }}</td>
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
  name: 'CartaoCredito',
  components: {
    'input-moeda': InputMoeda
  },
  created() {
    this.carregaListaCartoes()     
  },  
  data () {
    return {
      requestUrl: process.env.VUE_APP_ROOT_API,
      nomeCartao: null,
      bandeira: null,
      fechaDia: null,
      vencimentoDia: null,
      limite: null,
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
      
      axios.post(`${this.requestUrl}/cartaoCredito/listarCartoes`)
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
          Bandeira: this.bandeira.toString(),
          FechaDia: parseInt(this.fechaDia),
          VencimentoDia: parseInt(this.vencimentoDia),
          Limite: (this.limite) ? parseFloat(this.limite) : parseFloat(0)
        }

        axios.post(`${this.requestUrl}/cartaoCredito/cadastrar`, model, {
          headers: { 'Content-Type': 'application/json' }
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
            }.bind(this), 2000);
            this.carregaListaCartoes()
          })
          .catch( (error) => {
            this.mensagens.msgErro = error
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
