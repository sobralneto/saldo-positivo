<template>
  <div v-cloak>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-0 mb-3 border-bottom">
      <h1 class="h2">{{ headerPage }}</h1>
    </div>
    <div class="row">
      <div class="col-md-3 col-sm-12">
        <label>Valor <font color="red">*</font></label>
        <input-moeda id-campo="txtValor" v-model="lancamento.Valor" :valor-edicao="parseFloat(0)"></input-moeda>
      </div>
      <div class="col-md-3 col-sm-12">
        <label>Data <font color="red">*</font></label>
        <input type="date" class="form-control" maxlength="10" v-model="lancamento.Data" placeholder="dd/mm/aaaa" v-on:input="validaData" />
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-md-3 col-sm-12">
        <label>Categoria <font color="red">*</font></label>
        <select-categoria id-campo="ddlCategoria" v-model="lancamento.IdCategoria"></select-categoria>
      </div>
      <div class="col-md-3 col-sm-12">
        <label>Conta <font color="red">*</font></label>
        <select-conta id-campo="ddlConta" v-model="lancamento.IdContaCartaoCredito"></select-conta>
      </div>
      <div class="col-md-3 col-sm-12" v-show="mensagens.mostraContaSaida">
        <label>Conta Destino <font color="red">*</font></label>
        <select-conta id-campo="ddlContaSaida" v-model="lancamento.IdContaCartaoCreditoSaida"></select-conta>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-md-6 col-sm-12">
        <label>Descrição <font color="red">*</font></label>
        <input type="text" class="form-control" id="txtDescricao" v-model="lancamento.Descricao" />
      </div>
    </div>

    <div class="row mt-2">
      <div class="col-md-2 col-sm-4">
        <label>Pago?</label>
        <select class="form-control" v-model="lancamento.IndPaga">
          <option value="0">Não Pago</option>
          <option value="1">Pago</option>
        </select>
      </div>
      <div class="col-md-2 col-sm-4">
        <label>Repetir</label>
        <select class="form-control" id="ddlRepeticao" v-model="lancamento.QtdParcela" v-on:change="(lancamento.QtdParcela > 1) ? lancamento.TipoParcelamento = 30 : lancamento.TipoParcelamento = 0">
          <option value="1">Não</option>
          <option value="361">Fixo</option>
          <option v-for="i in maxParcelas-1" :value="i+1" :key="i+1">{{ i+1 }}</option>
        </select>
      </div>
      <div class="col-md-2 col-sm-4">
        <label>Parcelamento</label>
        <select class="form-control" id="ddlRepeticao" v-model="lancamento.TipoParcelamento">
          <option value="0">Não</option>
          <option v-for="tipo in arrayTipoParcelamento" :value="tipo.value" :key="tipo.value">{{tipo.texto}}</option>
        </select>
      </div>
    </div>
    <div class="row mt-2" v-show="lancamento.QtdParcela > 1">
      <div class="col-md-12 col-sm-12">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="chkDivideValor">
          <label class="custom-control-label" for="customCheck1">Dividir valor pelo número de parcelas</label>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-md-6 col-sm-12">
        <button @click="cadastrarLancamento" :class="classButton">{{ textButton }}</button>
        <p v-if="mensagens.listaErros.length" class="pt-3">
          <b>{{ mensagens.listaErros.length }} erro(s) encontrado(s) no cadastro:</b>
          <ul>
            <li class="text-danger" v-for="error in mensagens.listaErros" :key="error">{{ error }}</li>
          </ul>
        </p>
        <div class="alert alert-danger mt-3" role="alert" v-show="mensagens.msgErro">
          {{ mensagens.msgErro }}
        </div>
        <div class="alert alert-success mt-3" role="alert" v-show="mensagens.msgSucesso">
          {{ mensagens.msgSucesso }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputMoeda from '../../utilitarios/InputMoeda'
import SelectCategoria from '../../utilitarios/SelectCategoria'
import SelectConta from '../../utilitarios/SelectConta'
import axios from 'axios'
import moment from 'moment'
import Usuario from '../../../class/usuario'

export default {
  name: 'Lancamento',
  components: {
    'input-moeda': InputMoeda,
    'select-categoria': SelectCategoria,
    'select-conta': SelectConta
  },
  data () {
    return {
      requestUrl: process.env.VUE_APP_ROOT_API,
      headerPage: '',
      textButton: '',
      classButton: '',
      lancamento: {
        IdTipoLancamento: this.$route.params.tipo,
        Valor: 0,
        ValorSaida: null,
        Data: null,
        IdCategoria: 0,
        IdContaCartaoCredito: 0,
        IdContaCartaoCreditoSaida: 0,
        Descricao: null,
        QtdParcela: 1,
        TipoParcelamento: 0,
        IndPaga: 0,
        IdConta: 0,
        IdContaSaida: 0,
        IdCartaoCredito: 0
      },
      maxParcelas: 360,
      arrayTipoParcelamento: [
        { value: 30, texto: 'Mensal' },
        { value: 1, texto: 'Diário' },
        { value: 7, texto: 'Semanal' },
        { value: 15, texto: 'Quinzenal' },
        { value: 60, texto: 'Bimestral' },
        { value: 90, texto: 'Trimestral' },
        { value: 180, texto: 'Semestral' },
        { value: 365, texto: 'Anual' }
      ],
      mensagens: {
        listaErros: [],
        msgErro: '',
        msgSucesso: '',
        mostraContaSaida: false
      }
    }
  },
  watch: {
    '$route.params.tipo' (tipo) {
      this.lancamento.IdTipoLancamento = parseInt(tipo)
      this.configLayout()
    }
  },
  created () {
    this.configLayout()
  },
  methods: {
    configLayout () {
      if (parseInt(this.lancamento.IdTipoLancamento) > 3) {
        this.$router.push('/Dashboard')
      }

      this.mensagens.mostraContaSaida = false

      if (parseInt(this.lancamento.IdTipoLancamento) === 1) {
        this.textButton = 'Cadastrar Receita'
        this.classButton = 'btn btn-success btn-block'
        this.headerPage = 'Nova Receita'
      }

      if (parseInt(this.lancamento.IdTipoLancamento) === 2) {
        this.textButton = 'Cadastrar Despesa'
        this.classButton = 'btn btn-danger btn-block'
        this.headerPage = 'Nova Despesa'
      }

      if (parseInt(this.lancamento.IdTipoLancamento) === 3) {
        this.mensagens.mostraContaSaida = true
        this.textButton = 'Cadastrar Transferência'
        this.classButton = 'btn btn-dark btn-block'
        this.headerPage = 'Nova Transferência'
      }
    },
    reset () {
      this.lancamento.Valor = null
      this.lancamento.ValorSaida = null
      this.lancamento.Data = null
      this.lancamento.IdCategoria = 0
      this.lancamento.IdContaCartaoCredito = 0
      this.lancamento.IdContaCartaoCreditoSaida = 0
      this.lancamento.Descricao = null
      this.lancamento.QtdParcela = 1
      this.lancamento.TipoParcelamento = 0
      this.lancamento.IndPaga = 0
      this.lancamento.IdConta = 0
      this.lancamento.IdContaSaida = 0
      this.lancamento.IdCartaoCredito = 0
    },

    validaData () {
      let DataAtual = moment().locale('pt').format('YYYY-MM-DD')
      let compareDate = moment(this.lancamento.Data).isSameOrBefore(DataAtual)

      switch (compareDate) {
        case true:
          this.lancamento.IndPaga = 1
          break

        case false:
          this.lancamento.IndPaga = 0
          break

        default:
          break
      }
    },

    checkFormCadastro () {
      this.mensagens.msgErro = ''
      this.mensagens.msgSucesso = ''
      this.mensagens.listaErros = []

      if (!this.lancamento.Valor) this.mensagens.listaErros.push('Informe o valor')
      if (!this.lancamento.Data) this.mensagens.listaErros.push('Informe a data')
      if (!this.lancamento.IdCategoria) this.mensagens.listaErros.push('Informe a categoria')

      if (!this.lancamento.IdContaCartaoCredito) this.mensagens.listaErros.push('Informe a conta/cartão de crédito')

      if (parseInt(this.lancamento.IdTipoLancamento) === 3 && parseInt(this.lancamento.IdContaCartaoCreditoSaida) === 0) this.mensagens.listaErros.push('Informe a conta de destino')

      if (parseInt(this.lancamento.IdTipoLancamento) === 3 && parseInt(this.lancamento.IdContaCartaoCredito.IdConta) === parseInt(this.lancamento.IdContaCartaoCreditoSaida.IdConta)) this.mensagens.listaErros.push('Conta de destino não pode ser igual a conta de origem.')

      if (!this.lancamento.Descricao) this.mensagens.listaErros.push('Informe a descrição')

      if (parseInt(this.lancamento.QtdParcela) > 1 && parseInt(this.lancamento.TipoParcelamento) === 0) this.mensagens.listaErros.push('Informe o parcelamento')

      if (!this.mensagens.listaErros.length) return true
    },

    cadastrarLancamento () {
      if (this.checkFormCadastro()) {
        if (typeof this.lancamento.IdContaCartaoCredito.IdCartaoCredito === 'number') {
          this.lancamento.IdCartaoCredito = this.lancamento.IdContaCartaoCredito.IdCartaoCredito
        }

        if (typeof this.lancamento.IdContaCartaoCredito.IdConta === 'number') {
          this.lancamento.IdConta = this.lancamento.IdContaCartaoCredito.IdConta
        }

        if (typeof this.lancamento.IdContaCartaoCreditoSaida.IdConta === 'number') {
          this.lancamento.IdContaSaida = this.lancamento.IdContaCartaoCreditoSaida.IdConta
        }

        var model = this.lancamento
        model.Valor = parseFloat(this.lancamento.Valor)
        model.ValorSaida = model.Valor

        axios.post(`${this.requestUrl}/lancamento/cadastrar`, model, {
          crossdomain: true,
          headers: {
            Authorization: `Bearer ${Usuario.getToken()}`,
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            this.mensagens.msgSucesso = 'Lançamento cadastrado com sucesso'
            this.reset()
            document.getElementById('txtValor').focus()
            setTimeout(function () {
              this.mensagens.msgSucesso = ''
            }.bind(this), 2000)
          })
          .catch(e => {
            this.mensagens.msgErro = 'Erro ao cadastrar'
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
