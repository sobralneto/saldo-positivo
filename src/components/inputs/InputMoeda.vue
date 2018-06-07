<template>
  <div v-cloak>
    <input type="text" :id="idCampo" class="form-control" placeholder="0,00" v-model="ValorDigitado">
  </div>
</template>

<script>
export default {
  name: 'InputMoeda',
  props: {
    idCampo: String
  },
  computed: {
    ValorDigitado: {
      get()
      {
        let valorFormat = (!this.value) ? null : this.formatMoedaReal(this.value);
        //fazer a formatação do valor aqui         
        return valorFormat
      },
      set(c) { 
        this.$emit('input', this.formatMoedaReal(parseFloat(c))) 
      }
    }
  },
  methods: {
    formatMoedaReal (int) {

      if (int) {
          int = int.toString().replace('.','').replace(',','.')
          
          var tmp = int + '';
          tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
          if (tmp.length > 6) {
              tmp = tmp.replace(/([0-9]{3}).([0-9]{2}$)/g, ".$1,$2");
          }
          return tmp;
      }
  }
  }
}
</script>

<style scoped>

</style>
