<template>
  <div v-cloak>
    <div class="row">
      <div class="col-3">
        <label>Conta/Cartão</label>
        <select-conta id-campo="ddlConta" v-model="filtro.conta"></select-conta>
      </div>
      <div class="col-3">
        <label>Categoria</label>
        <select-categoria id-campo="ddlCategoria" v-model="filtro.idCategoria"></select-categoria>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 col-sm-12 pt-2 m-auto">
        <div class="alert alert-danger" role="alert" v-if="mensagens.msgErro">
            {{ mensagens.msgErro }}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 col-sm-12 pt-2 mb-5">
        <table class="table table-hover table-sm" style="font-size:14px;" v-if="resultado.listaLancamentos.length">
          <tbody>
            <tr v-for="(lt, index) in resultado.listaLancamentos" v-bind:key="index">
              <td style="vertical-align: middle;" v-html="getClassTipo(lt.IdTipoLancamento, lt.CorTipoLancamento)"></td>
              <td style="vertical-align: middle;">{{ lt.NomeCategoria }}</td>
              <td style="vertical-align: middle;">{{ lt.NomeConta }}</td>
              <td style="vertical-align: middle;">{{ lt.Descricao }}</td>
              <td style="vertical-align: middle;"><font v-bind:class="getColorMoney(lt.Valor)">{{ lt.Valor | formataMoeda}}</font></td>
              <td style="vertical-align: middle;">{{ lt.DataVencimentoString }}</td>
              <td style="vertical-align: middle;" v-if="!filtro.idCartaoCredito">
                <b-link @click="quitarLancamento(lt)" v-b-tooltip.hover :title="(lt.IndPaga) ? 'Lançamento quitado' : 'Quitar lançamento'" v-show="lt.IdLancamento">
                  <i :class="getClassStatus(lt.IndPaga)">grade</i>
                </b-link>
              </td>
              <td style="vertical-align: middle;">
                <router-link v-if="lt.IdConta == 0 && !filtro.idCartaoCredito" class="btn btn-outline-secondary btn-sm pt-0 pb-0 float-right ml-2" :to="{ name: 'CartaoCreditoDetalhe', params: { idCartao: lt.IdCartaoCredito} }">Fatura</router-link>
                <button v-if="lt.IdLancamento" class="btn btn-outline-danger btn-sm pt-0 pb-0 float-right ml-2" v-on:click="excluirLancamento(lt)">Excluir</button>
                <button v-if="lt.IdConta !== 0" class="btn btn-outline-primary btn-sm pt-0 pb-0 float-right" v-on:click="abreModalEdicao(index)">Editar</button>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div :class="'fixed-bottom border-top text-white p-0 {(valorTotalLancamentos) ? bg-gradient-success border-success : bg-gradient-danger border-danger  } float-right'" style="right: 0;" v-show="resultado.listaLancamentos.length">
      <div class="container float-right">
        <div class="row">
          <div class="col-md-2 m-2">
            {{ resultado.listaLancamentos.length }} lançamento(s)
          </div>
          <div class="col-md-2 m-2">
            {{ totalNaoQuitados }} não quitado(s)
          </div>
          <div class="col-md-2 m-2">
            {{ totalQuitados }} quitado(s)
          </div>
          <div class="col-md-4 m-2">
            Total: {{ valorTotalLancamentos | formataMoeda }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import myLib from '../../../funcoes/myLib'
import axios from 'axios'
import Usuario from '../../../class/usuario'
import SelectCategoria from '../../utilitarios/SelectCategoria'
import SelectConta from '../../utilitarios/SelectConta'

export default {
  name: 'TabelaLancamentos',
  components: {
    'select-categoria': SelectCategoria,
    'select-conta': SelectConta
  },
  props: [],
  created () {
    this.consultarLancamentos()
  },
  data () {
    return {
      requestUrl: process.env.VUE_APP_ROOT_API,
      resultado: {
        listaLancamentos: []
      },
      mensagens: {
        listaErros: [],
        msgErro: '',
        msgSucesso: ''
      },
      acoes: {
        arrayAcoes: [],
        indexArrayAcao: null,
        tituloModal: '',
        classHeaderModal: 'modal-header bg-primary text-white'
      },
      filtro: {
        idCartaoCredito: this.$store.state.filtroConsulta.idContaCartao,
        mesVigenteInt: this.$store.state.filtroConsulta.mesVigenteInt,
        anoVigente: this.$store.state.filtroConsulta.anoVigente,
        idCategoria: 0,
        conta: null
      }
    }
  },
  watch: {
    '$store.state.filtroConsulta.mesVigenteInt' () {
      this.consultarLancamentos()
    },
    'filtro.conta' () {
      this.consultarLancamentos()
    },
    'filtro.idCategoria' () {
      this.consultarLancamentos()
    }
  },
  methods: {

    consultarLancamentos () {
      this.filtro.mesVigenteInt = this.$store.state.filtroConsulta.mesVigenteInt
      this.filtro.anoVigente = this.$store.state.filtroConsulta.anoVigente

      this.mensagens.msgErro = ''

      var model = {
        MesVigenteId: parseInt(this.filtro.mesVigenteInt),
        AnoVigenteId: parseInt(this.filtro.anoVigente),
        IdCartaoCredito: (!this.filtro.idCartaoCredito || parseInt(this.filtro.idCartaoCredito) === 0) ? null : parseInt(this.filtro.idCartaoCredito),
        IdConta: (!this.filtro.conta || parseInt(this.filtro.conta) === 0) ? null : parseInt(this.filtro.conta.IdConta),
        IdCategoria: (parseInt(this.filtro.idCategoria) === 0) ? null : parseInt(this.filtro.idCategoria)
      }

      console.log(model)

      axios.post(`${this.requestUrl}/lancamento/listar`, model, {
        crossdomain: true,
        headers: {
          Authorization: `Bearer ${Usuario.getToken()}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          this.resultado.listaLancamentos = []
          if (response.status === 200) {
            this.resultado.listaLancamentos = response.data
          } else {
            this.resultado.listaLancamentos = []
            this.mensagens.msgErro = 'Nenhum resultado encontrado'
          }
        })
        .catch(error => {
          this.resultado.listaLancamentos = []
          this.mensagens.msgErro = error
        })
    },

    getClassTipo (tipoLancamento, cor) {
      switch (tipoLancamento) {
        case 0:
          return `<i class="material-icons text-${cor}">fiber_manual_record</i>`

        case 1:
          return `<i class="material-icons text-${cor}">fiber_manual_record</i>`

        case 2:
          return `<i class="material-icons text-${cor}">fiber_manual_record</i>`

        case 3:
          return `<i class="material-icons text-${cor}">compare_arrows</i>`

        default:
          break
      }
    },

    getColorMoney (value) {
      if (parseFloat(value) < parseFloat(0)) { return 'text-danger' }

      if (parseFloat(value) >= parseFloat(0)) { return 'text-success' }
    },

    getClassStatus (indPaga) {
      if (indPaga === 0) { return 'material-icons text-danger' }

      if (indPaga === 1) { return 'material-icons text-success' }
    },

    quitarLancamento (objectLancamento) {
      var model = {
        idLancamento: parseInt(objectLancamento.IdLancamento),
        status: (objectLancamento.IndPaga) ? 0 : 1
        // se true: troca para não quitada | se false: troca para quitada
      }

      axios.get(`${this.requestUrl}/lancamento/quitar`, {
        crossdomain: true,
        headers: {
          Authorization: `Bearer ${Usuario.getToken()}`,
          'Content-Type': 'application/json'
        },
        params: model
      })
        .then(response => {
          objectLancamento.IndPaga = (objectLancamento.IndPaga) ? 0 : 1
        })
        .catch(() => {
          this.mensagens.msgErro = 'Ocorreu algum erro no carregamento dos dados'
        })
    },

    excluirLancamento (objectLancamento) {
      var model = {
        idLancamento: parseInt(objectLancamento.IdLancamento),
        vinculoLancamentos: objectLancamento.VinculoEntreLancamentos.toString()
      }

      axios.get(`${this.requestUrl}/lancamento/excluir`, {
        crossdomain: true,
        headers: {
          Authorization: `Bearer ${Usuario.getToken()}`,
          'Content-Type': 'application/json'
        },
        params: model
      }).then((response) => {
        this.resultado.listaLancamentos = this.resultado.listaLancamentos.filter(function (el) {
          return parseInt(el.VinculoEntreLancamentos) !== parseInt(objectLancamento.VinculoEntreLancamentos)
        })

        if (!this.resultado.listaLancamentos.length) { this.mensagens.msgErro = 'Nenhum resultado encontrado' }
      })
        .catch((error) => {
          console.log('error', error)
          this.mensagens.msgErro = error
        })
    }
  },
  computed: {
    valorTotalLancamentos () {
      return this.resultado.listaLancamentos.reduce(function (total, v) {
        return parseFloat(myLib.replaceVirgulaMoeda(total)) + parseFloat(myLib.replaceVirgulaMoeda(v.Valor))
      }, 0)
    },
    totalNaoQuitados () {
      return this.resultado.listaLancamentos.reduce(function (total, v) {
        return (v.IndPaga === 0 && v.IdLancamento !== 0) ? parseInt(total) + 1 : parseInt(total)
      }, 0)
    },
    totalQuitados () {
      return this.resultado.listaLancamentos.reduce(function (total, v) {
        return (v.IndPaga === 1 && v.IdLancamento !== 0) ? parseInt(total) + 1 : parseInt(total)
      }, 0)
    }
  }
}
</script>

<style scoped>

</style>
