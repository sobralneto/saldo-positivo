<template>
  <div v-cloak>
    <div class="col-md-12 col-sm-12 pt-4">
      <canvas id="chart-conta" class="m-auto" style="max-height: 400px; max-width: 95%;"></canvas>
    </div>
  </div>
</template>

<script>
  import Chart from 'chart.js'
  import axios from 'axios'
  import myLib from '../../../funcoes/myLib'
  import 'google-palette'
  var palette = require("google-palette")

  export default {
    name: 'ChartConta',
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
          chartConta: null
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

        axios.post(`${this.requestUrl}/relatorio/conta`, model, {
          headers: { 'Content-Type': 'application/json' }
        })
          .then((response) => {

            this.resultadoGrafico = response.data

            this.grafico.arrayValor = []
            this.grafico.arrayLabel = []

            this.resultadoGrafico.forEach(obj =>{
              this.grafico.arrayValor.push(obj.ValorLancamento)
              this.grafico.arrayLabel.push(obj.NomeConta)
            })

            this.createChart()            

          })
          .catch((error) => {
            this.mensagens.msgErro = 'Ocorreu algum erro no carregamento dos dados'
          })

      },

      createChart () {

        let _arrayValor = this.grafico.arrayValor
        let _arrayLabel = this.grafico.arrayLabel

        let canvasConta = document.getElementById('chart-conta')
        
        if (this.grafico.chartConta != null) {

          this.grafico.chartConta.data.labels = _arrayLabel
          this.grafico.chartConta.data.datasets[0].data = _arrayValor
          this.grafico.chartConta.data.backgroundColor = palette('tol-rainbow', _arrayLabel.length).map(function (hex) {
            return '#' + hex;
          })
          this.grafico.chartConta.update();

        } else {
          
          this.grafico.chartConta = new Chart(canvasConta, {
            type: 'bar',
            data: {
              labels: _arrayLabel,
              datasets: [{
                data: _arrayValor,
                backgroundColor: palette('tol-rainbow', _arrayLabel.length).map(function (hex) {
                  return '#' + hex;
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
                      return tick.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                    }
                  }
                }]
              },
              tooltips: {
                callbacks: {
                  label: function (tooltipItem, data) {
                    return `R$ ${myLib.formatMoedaReal(parseFloat(tooltipItem.yLabel).toFixed(2))}`;
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