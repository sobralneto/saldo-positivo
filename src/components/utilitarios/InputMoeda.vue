<template>
  <div v-cloak>
    <money :id="idCampo" v-model="valorDigitado" v-bind="money" class="form-control"></money>
  </div>
</template>

<script>
import {Money} from 'v-money'

export default {
  components: {Money},
  data () {
    return {
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        suffix: '',
        precision: 2,
        masked: false
      }
    }
  },
  name: 'InputMoeda',
  props: {
    idCampo: String,
    valorEdicao: Number
  },
  computed: {
    valorDigitado: {
      get () { return this.valorEdicao },
      set (c) { this.$emit('input', c) }
    }
  }
}
</script>

<style scoped>

</style>
