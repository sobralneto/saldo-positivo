<template>
  <div v-cloak>
    <filtro-lancamento></filtro-lancamento>
  </div>
</template>

<script>

import FiltroLancamento from '../../utilitarios/FiltroLancamento'

export default {
  name: 'LancamentoConsulta',
  components: {
    'filtro-lancamento': FiltroLancamento
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
