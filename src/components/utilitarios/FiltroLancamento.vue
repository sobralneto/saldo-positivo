<template>
  <div v-cloak>
    <div class="mx-auto">
      <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-light" v-on:click="trocaMesFiltro(-1)">
          <i class="material-icons" style="vertical-align: middle;">keyboard_arrow_left</i>
        </button>
                
        <div class="btn-group" role="group" style="width: 200px;">
          <button type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="width: 200px;">
            {{ mesVigenteString }}/{{ anoVigente }}
          </button>
          <div class="dropdown-menu" style="z-index: 9999;">
            <a style="cursor: pointer;" class="dropdown-item" v-for="(mes, index) in listaMesesFiltro" :key="mes" @click="filtro.mesVigenteInt=index+1; filtro.mesVigenteString=mes; consultarLancamentos()"> {{mes}}</a>
            <!--@click="filtro.mesVigenteInt=index+1; filtro.mesVigenteString=mes; consultarLancamentos()"-->
          </div>
        </div>

        <button type="button" class="btn btn-light" v-on:click="trocaMesFiltro(1)">
          <i class="material-icons" style="vertical-align: middle;">keyboard_arrow_right</i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  
  import moment from 'moment'

  export default  {
    name: 'FiltroLancamento',
    props: [
      'onClicked' 
    ],
    created () {
      let date = new Date()
      this.mesVigenteString = date.toLocaleString('pt-br', { month: 'long' }).toLowerCase().replace(/\b./g, function (a) { return a.toUpperCase() })
      this.mesVigenteInt = parseInt(date.getMonth() + 1)
      this.anoVigente = parseInt(date.getFullYear())
    },
    data() {
      return {
        idContaCartao: 0,
        mesVigenteInt: null,
        mesVigenteString: null,
        anoVigente: null,
        listaMesesFiltro:["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
      }
    },
    methods: {
      trocaMesFiltro (counter) {
        var day = new Date(this.anoVigente, this.mesVigenteInt-1, 1)
        var dayWrapper = moment(day).add(counter, 'months').format("DD-MM-YYYY")

        this.mesVigenteInt = parseInt(dayWrapper.split("-")[1])
        this.anoVigente = parseInt(dayWrapper.split("-")[2])
        this.mesVigenteString = this.listaMesesFiltro[this.mesVigenteInt-1]
      }
    },
    computed: {}
}
</script>

<style scoped>
</style>
