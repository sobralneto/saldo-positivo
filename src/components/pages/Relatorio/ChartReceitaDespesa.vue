<template>
  <div v-cloak>
    <div class="row pt-4 pb-3 m-auto">
      <div class="col-4 text-center">
        <b class="text-success">Receita: {{ grafico.valorReceita | formataMoeda }}</b>
      </div>
      <div class="col-4 text-center">
        <b class="text-danger">Despesa: {{ grafico.valorDespesa | formataMoeda }} </b>
      </div>
      <div class="col-4 text-center">
        <b class="text-dark">Total: {{ grafico.valorReceita + grafico.valorDespesa | formataMoeda }}</b>
      </div>
    </div>
    <div class="col-md-12 col-sm-12 pt-4">
      <canvas id="chart-receita-despesa" class="m-auto" style="max-height: 400px; max-width: 95%;"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
import axios from 'axios'
import myLib from '../../../funcoes/myLib'
import Usuario from '../../../class/usuario'

export default {
  name: 'ChartReceitaDespesa',
  data () {
    return {
      requestUrl: process.env.VUE_APP_ROOT_API,
      filtro: {
        considerarNaoPagos: true,
        mesVigenteInt: this.$store.state.filtroConsulta.mesVigenteInt,
        anoVigente: this.$store.state.filtroConsulta.anoVigente
      },
      mensagens: {
        msgErro: ''
      },
      grafico: {
        arrayValor: [],
        valorReceita: parseFloat(0),
        valorDespesa: parseFloat(0),
        chartRecDesp: null
      }
    }
  },
  mounted () {
    this.getChartData()
  },
  watch: {
    '$store.state.filtroConsulta.mesVigenteInt' () {
      this.getChartData()
    }
  },
  methods: {

    getChartData () {
      this.filtro.mesVigenteInt = this.$store.state.filtroConsulta.mesVigenteInt
      this.filtro.anoVigente = this.$store.state.filtroConsulta.anoVigente

      var model = {
        Mes: parseInt(this.filtro.mesVigenteInt),
        Ano: parseInt(this.filtro.anoVigente),
        ConsiderarNaoPagos: (this.filtro.considerarNaoPagos) ? 1 : 0
      }

      axios.post(`${this.requestUrl}/relatorio/receitaDespesa`, model, {
        crossdomain: true,
        headers: {
          Authorization: `Bearer ${Usuario.getToken()}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.grafico.arrayValor = []

          if (response.data[0]) {
            this.grafico.valorReceita = parseFloat(response.data[0].ValorLancamento)
            this.grafico.arrayValor.push(this.grafico.valorReceita)
          }

          if (response.data[1]) {
            this.grafico.valorDespesa = parseFloat(response.data[1].ValorLancamento)
            this.grafico.arrayValor.push((-1) * this.grafico.valorDespesa)
          }

          this.createChart()
        })
        .catch(e => {
          this.mensagens.msgErro = 'Ocorreu algum erro no carregamento dos dados'
        })
    },

    createChart () {
      let _arrayValor = this.grafico.arrayValor

      let canvasRecDesp = document.getElementById('chart-receita-despesa')

      if (this.grafico.chartRecDesp != null) {
        this.grafico.chartRecDesp.data.datasets[0].data = _arrayValor
        this.grafico.chartRecDesp.update()
      } else {
        this.grafico.chartRecDesp = new Chart(canvasRecDesp, {
          type: 'bar',
          data: {
            labels: ['Receitas', 'Despesas'],
            datasets: [{
              data: _arrayValor,
              backgroundColor: ['#a6e22e', '#d90000']
            }]
          },
          options: {
            legend: {
              display: false
            },
            animations: {
              animateScale: true
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function (tick, index, ticks) {
                    return tick.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  }
                }
              }]
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  return `R$ ${myLib.formatMoedaReal(parseFloat(tooltipItem.yLabel).toFixed(2))}`
                }
              }
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
