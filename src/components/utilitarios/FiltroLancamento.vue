<template>
  <div v-cloak>
    <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
      <button type="button" class="btn btn-light" v-on:click="trocaMesFiltro(-1)">
        <i class="material-icons" style="vertical-align: middle;">keyboard_arrow_left</i>
      </button>
              
      <div class="btn-group" role="group" style="width: 200px;">
        <button type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="width: 200px;">
          {{ mesVigenteString }}/{{ filtro.anoVigente }}
        </button>
        <div class="dropdown-menu" style="z-index: 9999;">
          <a style="cursor: pointer;" class="dropdown-item" v-for="(mes, index) in listaMesesFiltro" :key="mes" @click="filtro.mesVigenteInt=index+1; mesVigenteString=mes; trocaMesFiltro()"> {{mes}}</a>
          <!--@click="filtro.mesVigenteInt=index+1; filtro.mesVigenteString=mes; consultarLancamentos()"-->
        </div>
      </div>

      <button type="button" class="btn btn-light" v-on:click="trocaMesFiltro(1)">
        <i class="material-icons" style="vertical-align: middle;">keyboard_arrow_right</i>
      </button>
    </div>
  </div>
</template>

<script>
  
  import myLib from '../../funcoes/myLib.js'
  import moment from 'moment'

  export default  {
    name: 'FiltroLancamento',
    data () {
      return {
        filtro: {
          idContaCartao: this.$store.state.filtroConsulta.idContaCartao,
          mesVigenteInt: this.$store.state.filtroConsulta.mesVigenteInt,
          anoVigente: this.$store.state.filtroConsulta.anoVigente          
        },
        mesVigenteString: myLib.returnDate('monthName'),
        listaMesesFiltro:["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
      }
    },
    created () {
      this.trocaMesFiltro(0);
    },
    methods: {
      trocaMesFiltro (counter = 0) {
        var day = new Date(this.filtro.anoVigente, this.filtro.mesVigenteInt-1, 1)
        var dayWrapper = moment(day).add(counter, 'months').format("DD-MM-YYYY")

        this.filtro.mesVigenteInt = parseInt(dayWrapper.split("-")[1])
        this.filtro.anoVigente = parseInt(dayWrapper.split("-")[2])
        this.mesVigenteString = this.listaMesesFiltro[this.filtro.mesVigenteInt-1]
        this.filtro.idContaCartao = (typeof this.$route.params.idCartao !== 'undefined') ? this.$route.params.idCartao : null

        this.$store.commit('SET_FILTRO_CONSULTA', this.filtro)

      }
    },
    computed: {}
}
</script>

<style scoped>
</style>
