<template>
  <div v-cloak>
    <b-button-toolbar>
      <b-button-group class="mx-1">
        <b-button @click="trocaMesFiltro(-1)" variant="mr-0" class="btn-outline-indigo">
          <i class="material-icons" style="vertical-align: middle;">keyboard_arrow_left</i>
        </b-button>
      </b-button-group>
      <b-dropdown class="mx-1" right :text="mesVigenteString + '/' + filtro.anoVigente" variant="indigo">
        <b-dropdown-item style="cursor: pointer;" v-for="(mes, index) in listaMesesFiltro" :key="mes" @click="filtro.mesVigenteInt=index+1; mesVigenteString=mes; trocaMesFiltro()"> {{mes}}</b-dropdown-item>
      </b-dropdown>
      <b-button-group class="mx-1">
        <b-button @click="trocaMesFiltro(1)" variant="mr-0" class="btn-outline-indigo">
          <i class="material-icons" style="vertical-align: middle;">keyboard_arrow_right</i>
        </b-button>
      </b-button-group>
    </b-button-toolbar>
  </div>
</template>

<script>
import myLib from '../../funcoes/myLib.js'
import moment from 'moment'

export default {
  name: 'FiltroLancamento',
  data () {
    return {
      filtro: {
        idContaCartao: this.$store.state.filtroConsulta.idContaCartao,
        mesVigenteInt: this.$store.state.filtroConsulta.mesVigenteInt,
        anoVigente: this.$store.state.filtroConsulta.anoVigente
      },
      mesVigenteString: myLib.returnDate('monthName'),
      listaMesesFiltro: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    }
  },
  created () {
    this.trocaMesFiltro(0)
  },
  methods: {
    trocaMesFiltro (counter = 0) {
      var day = new Date(this.filtro.anoVigente, this.filtro.mesVigenteInt - 1, 1)
      var dayWrapper = moment(day).add(counter, 'months').format('DD-MM-YYYY')

      this.filtro.mesVigenteInt = parseInt(dayWrapper.split('-')[1])
      this.filtro.anoVigente = parseInt(dayWrapper.split('-')[2])
      this.mesVigenteString = this.listaMesesFiltro[this.filtro.mesVigenteInt - 1]
      this.filtro.idContaCartao = (typeof this.$route.params.idCartao !== 'undefined') ? this.$route.params.idCartao : null

      this.$store.commit('SET_FILTRO_CONSULTA', this.filtro)
    }
  },
  computed: {}
}
</script>

<style scoped>
</style>
