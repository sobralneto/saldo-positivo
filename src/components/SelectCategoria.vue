<template>
  <span>
    <select class="form-select" :id="id" v-model="$attrs.value" @input="$emit('input', $event.target.value)">
      <option value="null">Selecione</option>
      <option v-for="categoria in categorias" :value="categoria.categoriaId" :key="categoria.nome">{{ categoria.nome }}</option>
    </select>
  </span>
</template>

<script>
import CategoriaService from '../services/categoria-service';

export default {
  props: {
    id: { type: String, default: 'ddlCategoria', required: true },
    tipoLancamentoId: { type: String, default: null },
  },
  name: 'select-categoria',
  data() {
    return {
      categorias: [],
    };
  },
  mounted() {
    this.GetCategorias()
  },
  watch: {
    tipoLancamentoId(){
      this.GetCategorias();
    }
  },
  methods: {
    async GetCategorias() {
      const RESPONSE = await CategoriaService.GetCategorias();
      this.categorias = RESPONSE ? RESPONSE.filter(categoria => !this.tipoLancamentoId || parseInt(this.tipoLancamentoId) === parseInt(categoria.tipoLancamentoId)) : [];      
    },
  },
};
</script>

<style></style>
