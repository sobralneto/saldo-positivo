<template>
  <div v-cloak>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-0 mb-3">
    </div>
    <div class="row">
      <div class="mx-auto">
        <filtro-lancamento></filtro-lancamento>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <tabela-lancamentos></tabela-lancamentos>
      </div>
    </div>
  </div>
</template>

<script>
import FiltroLancamento from '../../utilitarios/FiltroLancamento'
import TabelaLancamentos from './LancamentoGrid'

export default {
  name: 'LancamentoConsulta',
  components: {
    'filtro-lancamento': FiltroLancamento,
    'tabela-lancamentos': TabelaLancamentos
  },
  data () {
    return {
      idConta: null
    }
  }
}
</script>

<style scoped>

</style>
