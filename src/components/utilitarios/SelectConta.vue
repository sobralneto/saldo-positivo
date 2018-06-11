<template>
  <div v-cloak>
    <select class="form-control" :id="idCampo" v-model="selected">
      <option value="0">Selecione</option>
        <optgroup label="Contas">
            <option v-for="ct in listaContas" :value="ct" :key="ct.Nome">{{ ct.Nome }}</option>
        </optgroup>
        <optgroup label="Cartões de Crédito">
            <option v-for="cc in listaCartoes" :value="cc" :key="cc.Nome">{{ cc.Nome }}</option>
        </optgroup>
    </select>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SelectConta',
  props: {
    idCampo: String
  },
  data () {        
    return {
      requestUrl: process.env.VUE_APP_ROOT_API,
      listaContas: [],
      listaCartoes: [],
      idConta: 0
    }
  },
  created () {
    this.carregaDados()
  },
  computed: {
    selected: {
      get () { return 0 },
      set (c) { this.$emit('input', c) }
    }
  },
  methods: {
    carregaDados () {
      axios.post(`${this.requestUrl}/conta/listarContas`)
        .then((response) => {
          this.listaContas = response.data
        })
        .catch()

      axios.post(`${this.requestUrl}/cartaoCredito/listarCartoes`)
        .then(response => {
          this.listaCartoes = response.data
        })
        .catch()
    }
  }
}
</script>

<style scoped>

</style>
