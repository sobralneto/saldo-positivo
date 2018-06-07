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

export default {
  name: 'SelectCategoria',
  props: {
    idCampo: String
  },
  data() {        
    return{
      requestUrl: process.env.VUE_APP_ROOT_API,
      listaCategorias: [],
      idCategoria: 0            
    }
  },
  created() {
    this.carregaDados();
  },
  computed: {
    selected: {
      get(){ return 0 },
      set(c){ this.$emit('input', c) }
    }
  },
  methods:{    
    carregaDados () {
      axios.post(`${this.requestUrl}/categoria/listarCategorias`)
      .then( (response) => {
        this.listaCategorias = response.data
      })
      .catch()
    }
  }
}
</script>

<style scoped>

</style>