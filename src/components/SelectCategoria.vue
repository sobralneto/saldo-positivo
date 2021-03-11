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
	},
	name: 'select-categoria',
	data() {
		return {
			categorias: [],
		};
	},
	mounted() {
		this.GetCategorias();
	},
	methods: {
		async GetCategorias() {
			this.categorias = await CategoriaService.GetCategorias();
		},
	},
};
</script>

<style></style>
