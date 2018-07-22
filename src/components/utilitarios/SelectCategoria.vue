<template>
  <div v-cloak>
    <select class="form-control" :id="idCampo" v-model="selected">
      <option value="0">Selecione</option>
      <option v-for="c in listaCategorias" :value="c.IdCategoria" :key="c.IdCategoria">{{ c.Nome }}</option>
    </select>
  </div>
</template>

<script>
import axios from 'axios'
import Usuario from '../../class/usuario'

export default {
  name: 'SelectCategoria',
  props: {
    idCampo: String
  },
  data () {
    return {
      requestUrl: process.env.VUE_APP_ROOT_API,
      listaCategorias: [],
      idCategoria: 0
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
      axios.get(`${this.requestUrl}/categoria/listarCategorias`, {
        crossdomain: true,
        headers: {
          Authorization: `Bearer ${Usuario.getToken()}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.listaCategorias = response.data
        })
        .catch()
    }
  }
}
</script>

<style scoped>

</style>
