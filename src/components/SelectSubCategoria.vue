<template>
	<span>
		<select class="form-select" :id="id" :disabled="!subCategoriaFiltered.length" v-model="$attrs.value" @input="$emit('input', $event.target.value)">
			<option value="null">Selecione</option>
			<option v-for="subCategoria in subCategoriaFiltered" :value="subCategoria.subCategoriaId" :key="subCategoria.nome">{{ subCategoria.nome }}</option>
		</select>
	</span>
</template>

<script>
import SubCategoriaService from '../services/subcategoria-service';

export default {
	name: 'select-sub-categoria',
	props: {
		id: { type: String, default: 'ddlCategoria', required: true },
		categoriaId: { type: Number, default: null },
	},
	data() {
		return {
			subCategorias: [],
		};
	},
	mounted() {
		this.GetSubCategorias();
	},
	computed: {
		subCategoriaFiltered() {
			this.$emit('input', null);
			return this.categoriaId ? this.subCategorias.filter(sub => sub.categoriaId === parseInt(this.categoriaId)) : [];
		},
	},
	methods: {
		async GetSubCategorias() {
			this.subCategorias = await SubCategoriaService.GetSubCategorias();
		},
	},
};
</script>

<style></style>
