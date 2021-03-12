<template>
	<div class="d-flex flex-column w-100">
		<loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
		<div class="d-flex flex-column align-items-center justify-content-center mt-4">
			<div class="col-12 d-flex align-items-center justify-content-center mb-3">
				<div class="mx-2">
					<button class="btn btn-sm px-1 py-0 btn-outline-primary" @click="AddMonth(-1)">Anterior</button>
				</div>
				<div class="mx-2">{{ dateFilterFormatted }}</div>
				<div class="mx-2">
					<button class="btn btn-sm px-1 py-0 btn-outline-primary" @click="AddMonth(1)">Próximo</button>
				</div>
			</div>
			<div class="col-12">
				<lancamentos :filter="filter" :reload.sync="reload" :lancamento-edit.sync="lancamentoEdit"></lancamentos>
			</div>
		</div>
		<div class="row">
			<div class="col-md-6">
				<div class="card shadow-sm">
					<div class="card-header">Despesas por categoria</div>
					<div class="card-body">
						<BarChart></BarChart>
					</div>
				</div>
			</div>
			<div class="col-md-6">
				<div class="card shadow-sm">
					<div class="card-header">Receitas x Despesas</div>
					<div class="card-body">
						<PieChart></PieChart>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	components: {
		BarChart: () => import('../components/BarChart'),
		PieChart: () => import('../components/PieChart'),
	},
	data() {
		return {
			filter: {
				ano: null,
				mes: null,
			},
			isLoading: false,
		};
	},
	computed: {
		dateFilterFormatted() {
			if (!this.filter.mes) return '00/0000';
			const mes = `0${this.filter.mes}`;
			return `${mes.substring(String(mes).length, String(mes).length - 2)}/${this.filter.ano}`;
		},
	},
	mounted() {
		const date = new Date();
		date.setMonth(date.getMonth() + 1);
		this.filter.ano = date.getFullYear();
		this.filter.mes = date.getMonth();
	},
	methods: {
		AddMonth(_increment) {
			const date = new Date(this.filter.ano, this.filter.mes - 1, 1);
			date.setMonth(date.getMonth() + _increment);
			this.filter.ano = parseInt(date.toLocaleDateString('pt-BR').split('/')[2]);
			this.filter.mes = parseInt(date.toLocaleDateString('pt-BR').split('/')[1]);
		},
	},
};
</script>

<style></style>
