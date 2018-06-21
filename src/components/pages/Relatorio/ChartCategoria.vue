<template>
  <div v-cloak>
    <div class="col-md-6 col-sm-12 pt-4 float-left">
      <canvas id="chart-categoria-receita" class="m-auto" style="max-height: 400px; max-width: 95%;"></canvas>
    </div>
    <div class="col-md-6 col-sm-12 pt-4 float-right">
      <canvas id="chart-categoria-despesa" class="m-auto" style="max-height: 400px; max-width: 95%;"></canvas>
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
    name: 'ChartCategoria',
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
          arrayValorReceita: [],
          arrayLabelReceita: [],
          chartCategoriaReceita: null,
          arrayValorDespesa: [],
          arrayLabelDespesa: [],
          chartCategoriaDespesa: null
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

        axios.post(`${this.requestUrl}/relatorio/categoria`, model, {
          headers: { 'Content-Type': 'application/json' }
        })
          .then((response) => {

            this.resultadoGrafico = response.data.Agrupado

            this.grafico.arrayLabelReceita = []
            this.grafico.arrayValorReceita = []

            this.grafico.arrayLabelDespesa = []
            this.grafico.arrayValorDespesa = []

            this.resultadoGrafico.forEach(obj =>{

              console.log(obj)
              
              if (parseFloat(obj.ValorLancamento) < 0) {

                this.grafico.arrayLabelDespesa.push(`${obj.GrupoCategoria} | Valor: R$ ${myLib.formatMoedaReal(parseFloat((-1) * obj.ValorLancamento).toFixed(2))}`)

                this.grafico.arrayValorDespesa.push((-1) * obj.ValorLancamento)

              } else {
                
                this.grafico.arrayLabelReceita.push(`${obj.GrupoCategoria} | Valor: R$ ${myLib.formatMoedaReal(parseFloat(obj.ValorLancamento).toFixed(2))}`);
                
                this.grafico.arrayValorReceita.push(obj.ValorLancamento);

              }

            })

            console.log(this.grafico.arrayValorDespesa)

            this.createChart()            

          })
          .catch((error) => {
            this.mensagens.msgErro = 'Ocorreu algum erro no carregamento dos dados'
          })

      },

      createChart () {

        let _arrayValorReceita = this.grafico.arrayValorReceita
        let _arrayLabelReceita = this.grafico.arrayLabelReceita

        let _arrayValorDespesa = this.grafico.arrayValorDespesa
        let _arrayLabelDespesa = this.grafico.arrayLabelDespesa
              

        var datasetReceita = {
          labels: _arrayLabelReceita,
          data: _arrayValorReceita,
          backgroundColor: palette('tol-rainbow', _arrayValorReceita.length, 2).map(function (hex) {
            return '#' + hex;
          })
        };

        var elementsReceitas = {
          center: {
            text: eval(_arrayValorReceita.join("+")),
            fontStyle: 'Helvetica', //Default Arial
            sidePadding: 50 //Default 20 (as a percentage)
          }
        };

        var datasetDespesa = {
          labels: _arrayLabelDespesa,
          data: _arrayValorDespesa,
          backgroundColor: palette('tol-rainbow', _arrayValorDespesa.length).map(function (hex) {
            return '#' + hex;
          })
        };

        var elementsDespesas = {
          center: {
            text: eval(_arrayValorDespesa.join("+")),
            fontStyle: 'Helvetica', //Default Arial
            sidePadding: 50 //Default 20 (as a percentage)
          }
        };

        var config = {
          type: 'doughnut',
          data: {
            labels: [],
            datasets: []
          },
          options: {
            title: {
              display: true,
              text: ''
            },
            legend: { position: 'right' },
            responsive: true,
            animations: {
              animateScale: true,
              animateRotate: true
            },
            pieceLabel: {
              mode: 'percentage',
              precision: 0,
              fontSize: 18,
              fontColor: '#fff',
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  return data.labels[tooltipItem.index];
                }
              }
            }
          },
          elements: {}
        }

        var configDespesa = config;
        configDespesa.options.title.text = 'Despesas';
        configDespesa.data.labels = _arrayLabelDespesa;
        configDespesa.elements = elementsDespesas;
        configDespesa.data.datasets = [];
        configDespesa.data.datasets.push(datasetDespesa);

        //config.options.title.text = 'Receitas';
        //config.data.labels = _arrayLabelReceita;
        //config.elements = elementsReceitas;
        //config.data.datasets = [];
        //config.data.datasets.push(datasetReceita);

        let canvasReceita = document.getElementById('chart-categoria-receita')
        let canvasDespesa = document.getElementById('chart-categoria-despesa')

        /*
        if (this.grafico.chartCategoriaReceita != null) {
          this.grafico.chartCategoriaReceita.update();
        } else {          
          this.grafico.chartCategoriaReceita = new Chart(canvasReceita, config);
        }
        */

        
        if (this.grafico.chartCategoriaDespesa != null) {
          this.grafico.chartCategoriaDespesa.update();
        } else {          
          this.grafico.chartCategoriaDespesa = new Chart(canvasDespesa, config);
        }
        

      }

    }

  }
</script>

<style scoped>

</style>