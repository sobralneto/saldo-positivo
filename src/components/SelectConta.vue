<template>
	<span>
		<select class="form-select" :id="id" v-model="$attrs.value" @input="$emit('input', $event.target.value)">
			<option value="null">Selecione</option>
			<option v-for="conta in contas" :value="conta.contaId" :key="conta.nome">{{ conta.nome }}</option>
		</select>
	</span>
</template>

<script>
import ContaService from '../services/conta-service';

export default {
	name: 'select-conta',
	props: {
		id: { type: String, default: 'ddlConta', required: true },
	},
	data() {
		return {
			contas: [],
		};
	},
	mounted() {
		this.GetContas();
	},
	methods: {
		async GetContas() {
			this.contas = await ContaService.GetContas();
		},
	},
};
</script>

<style></style>
