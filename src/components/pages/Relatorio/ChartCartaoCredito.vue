<template>
  <div v-cloak>
    <div class="col-md-12 col-sm-12 pt-4">
      <canvas id="chart-cartao-credito" class="m-auto" style="max-height: 400px; max-width: 95%;"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
import axios from 'axios'
import myLib from '../../../funcoes/myLib'
import Usuario from '../../../class/usuario'
import 'google-palette'
var palette = require('google-palette')

export default {
  name: 'ChartCartaoCredito',
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
      resultadoGrafico: [],
      grafico: {
        arrayValor: [],
        arrayLabel: [],
        chartCartao: null
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

      axios.post(`${this.requestUrl}/relatorio/cartao`, model, {
        crossdomain: true,
        headers: {
          Authorization: `Bearer ${Usuario.getToken()}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.resultadoGrafico = response.data

          this.grafico.arrayValor = []
          this.grafico.arrayLabel = []

          this.resultadoGrafico.forEach(obj => {
            this.grafico.arrayValor.push(obj.ValorLancamento)
            this.grafico.arrayLabel.push(obj.NomeCartao)
          })

          this.createChart()
        })
        .catch(e => {
          this.mensagens.msgErro = 'Ocorreu algum erro no carregamento dos dados'
        })
    },

    createChart () {
      let _arrayValor = this.grafico.arrayValor
      let _arrayLabel = this.grafico.arrayLabel

      let canvasConta = document.getElementById('chart-cartao-credito')

      if (this.grafico.chartCartao != null) {
        this.grafico.chartCartao.data.labels = _arrayLabel
        this.grafico.chartCartao.data.datasets[0].data = _arrayValor
        this.grafico.chartCartao.data.backgroundColor = palette('tol-rainbow', _arrayLabel.length).map(function (hex) {
          return '#' + hex
        })
        this.grafico.chartCartao.update()
      } else {
        this.grafico.chartCartao = new Chart(canvasConta, {
          type: 'bar',
          data: {
            labels: _arrayLabel,
            datasets: [{
              data: _arrayValor,
              backgroundColor: palette('tol-rainbow', _arrayLabel.length).map(function (hex) {
                return '#' + hex
              })
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
