<template>
	<div>
		<loading :active.sync="isLoading" :can-cancel="false" :is-full-page="false"></loading>
		<div v-if="isEmpty" class="alert alert-warning col-12">
			Nenhum lançamento encontrado
		</div>
		<div v-if="lancamentos.length && !isEmpty">
			<div class="card shadow-sm mb-1">
				<div class="card-body alert-secondary text-dark p-1 d-flex fw-bold">
					<div class="col-2">Data</div>
					<div class="col-3">Conta</div>
					<div class="col-3">Categoria</div>
					<div class="col-2">Valor</div>
				</div>
			</div>

			<div v-for="(lancamento, index) in lancamentos" :key="lancamento.lancamentoId" class="card shadow-sm mb-1">
				<div class="card-body bg-white p-1 d-flex">
					<div class="col-2">{{ lancamento.dataLancamento | dateFormatted }}</div>
					<div class="col-3">
						<span v-if="parseInt(lancamento.tipoLancamentoId) !== 3">{{ lancamento.conta }}</span>
						<span v-if="parseInt(lancamento.tipoLancamentoId) === 3">{{ lancamento.conta }} <i class="bi bi-arrow-bar-right"></i> {{ lancamento.contaDestino }}</span>
					</div>
					<div class="col-3">
						{{ lancamento.subCategoria }}
						<small class="font-italic" v-if="lancamento.subCategoria">{{ lancamento.categoria }}</small>
						<span v-if="!lancamento.subCategoria">{{ lancamento.categoria }}</span>
					</div>
					<div class="col-2">
						<i class="bi bi-box-arrow-in-down text-teal" v-if="parseInt(lancamento.tipoLancamentoId) === 1"></i>
						<i class="bi bi-box-arrow-up text-danger" v-if="parseInt(lancamento.tipoLancamentoId) === 2"></i>
						<i class="bi bi-arrow-left-right" v-if="parseInt(lancamento.tipoLancamentoId) === 3"></i>
						{{ lancamento.valor | moneyFormatted }}
					</div>
					<div class="col-2 d-flex align-items-end justify-content-end">
						<i class="bi bi-hand-thumbs-down text-danger cursor-pointer mx-2" @click="QuitarLancamento(index)" v-if="!lancamento.quitado"></i>
						<i class="bi bi-hand-thumbs-up-fill text-teal cursor-pointer mx-2" @click="QuitarLancamento(index)" v-if="lancamento.quitado"></i>
						<i class="bi bi-pencil-square text-dark cursor-pointer mx-2" @click="$emit('update:lancamentoEdit', lancamento)"></i>
						<i @click="DeleteLancamento(index)" class="bi bi-trash-fill text-danger cursor-pointer mx-2"></i>
					</div>
				</div>
			</div>

			<div class="card shadow-sm mb-2">
				<div class="card-body alert-secondary text-dark p-1 d-flex fw-bold">
					<div class="col-8 text-center">Total</div>
					<div class="col-2">{{ totalLancamentos }}</div>
					<div class="col-2"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import SERVICE from '../services/lancamento-service';
import { FormatDate, FormatCurrency } from '../helpers/util';

import Loading from 'vue-loading-overlay';

export default {
	name: 'Lancamentos',
	components: {
		Loading,
	},
	props: {
		filter: { type: Object, required: true },
		reload: { type: Boolean, default: false },
	},
	data() {
		return {
			lancamentos: [],
			isEmpty: false,
			isLoading: false,
		};
	},
	filters: {
		dateFormatted(_value) {
			return FormatDate(_value);
		},
		moneyFormatted(_value) {
			return FormatCurrency(parseFloat(_value) || 0);
		},
	},
	computed: {
		totalLancamentos() {
			return FormatCurrency(this.lancamentos.reduce((sum, lancamento) => sum + parseFloat(lancamento.valorOrignal), 0));
		},
	},
	watch: {
		reload(newValue) {
			if (newValue) this.GetLancamentos();
		},
		'filter.mes'() {
			this.GetLancamentos();
		},
	},
	mounted() {
		this.GetLancamentos();
	},
	methods: {
		async GetLancamentos() {
			try {
				this.lancamentos = [];
				this.isLoading = true;
				this.isEmpty = false;

				const RESPONSE = await SERVICE.GetLancamentosByMonth(this.filter);
				this.lancamentos = RESPONSE ? RESPONSE : [];
				this.isEmpty = !this.lancamentos.length;
				this.isLoading = false;
				this.$emit('update:reload', false);
			} catch (error) {
				console.error(error);
			}
		},
		async QuitarLancamento(index) {
			try {
				await SERVICE.QuitarLancamento(this.lancamentos[index].lancamentoId, !this.lancamentos[index].quitado);
				this.lancamentos[index].quitado = !this.lancamentos[index].quitado;
			} catch (error) {
				console.error(error);
			}
		},
		async DeleteLancamento(index) {
			try {
				this.isLoading = true;
				await SERVICE.DeleteLancamento(this.lancamentos[index].lancamentoId);
				this.lancamentos.splice(index, 1);
				this.isLoading = false;
				this.isEmpty = !this.lancamentos.length;
			} catch (error) {
				console.error(error);
			}
		},
	},
};
</script>

<style>
.cursor-pointer {
	cursor: pointer;
}
</style>
