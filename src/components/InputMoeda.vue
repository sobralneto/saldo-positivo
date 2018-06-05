<template>
  <div v-cloak>
    <input type="text" :id="idCampo" class="form-control" placeholder="0,00" v-model="ValorDigitado">
  </div>
</template>

<script>
  
  export default {
    name: 'InputMoeda',
    props: {
      idCampo: String,
      ValorLancamento: String
    },
    computed: {
      ValorDigitado: {
        get()
        {
          let valorFormat = (!this.ValorLancamento) ? null : this.ValorLancamento;
          //fazer a formatação do valor aqui         
          return valorFormat
        },
        set(c) { 
          this.$emit('input', c) 
        }
      }
    }
  }
</script>

<style scoped>

</style>
