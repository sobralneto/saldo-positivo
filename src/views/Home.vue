<template>
	<div class="d-flex flex-column w-100">
		<loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
		<div class="d-flex flex-row align-items-center justify-content-start py-3">
			<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
				<input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" value="1" v-model="model.tipoLancamentoId" />
				<label class="btn btn-sm btn-outline-success" for="btnradio1">Receita</label>

				<input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" value="2" v-model="model.tipoLancamentoId" />
				<label class="btn btn-sm btn-outline-danger" for="btnradio2">Despesa</label>
			</div>
		</div>
		<div class="row d-flex flex-row align-items-center justify-content-start">
			<div class="col">
				<label for="txtDataLancamento">Data <span class="text-danger fw-bold">*</span></label>
				<input type="date" id="txtDataLancamento" class="form-control" v-model="model.dataLancamento" />
			</div>
			<div class="col">
				<label for="ddlConta" v-if="model.tipoLancamentoId != 3">Conta <span class="text-danger fw-bold">*</span></label>
				<label for="ddlConta" v-if="model.tipoLancamentoId == 3">Conta origem <span class="text-danger fw-bold">*</span></label>
				<select-conta id="ddlConta" v-model="model.contaId"></select-conta>
			</div>
			<div class="col" v-if="model.tipoLancamentoId == 3">
				<label for="ddlContaDestino">Conta destino <span class="text-danger fw-bold">*</span></label>
				<select-conta id="ddlContaDestino" v-model="model.contaIdDestino"></select-conta>
			</div>
			<div class="col">
				<label for="ddlCategoria">Categoria <span class="text-danger fw-bold">*</span></label>
				<select-categoria id="ddlCategoria" v-model="model.categoriaId" :tipoLancamentoId="model.tipoLancamentoId"></select-categoria>
			</div>
			<div class="col">
				<label for="ddlSubCategoria">Sub Categoria</label>
				<select-sub-categoria id="ddlSubCategoria" v-model="model.subCategoriaId" :categoria-id="parseInt(model.categoriaId)"></select-sub-categoria>
			</div>
			<div class="col">
				<label for="txtValorLancamento">Valor <span class="text-danger fw-bold">*</span></label>
				<input type="text" class="form-control" id="txtValorLancamento" v-model="model.valor" @input="FormataValor()" v-if="!model.totalParcelas" />

				<div class="input-group" v-if="model.totalParcelas">
					<input type="text" class="form-control" id="txtValorLancamento" v-model="model.valor" @input="FormataValor()" />
					<span class="input-group-text" id="basic-addon2">{{ model.totalParcelas }}x {{ valorParcelado }}</span>
				</div>
			</div>
		</div>
		<div class="row mt-2 d-flex flex-row align-items-center justify-content-start">
			<div class="col-2">
				<label for="txtDataLancamento">Parcelas</label>
				<select class="form-select" id="ddlParcelas" v-model="model.totalParcelas">
					<option value="null">Selecione</option>
					<option v-for="parcela in 24" :value="parcela" :key="parcela">{{ parcela }}</option>
				</select>
			</div>
			<div v-if="model.totalParcelas" class="col-4">
				<div class="form-check">
					<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" v-model="model.dividirValor" />
					<label class="form-check-label" for="flexCheckDefault">
						Dividir o valor pelo número de parcelas
					</label>
				</div>
			</div>
		</div>
		<div class="mt-3 d-flex flex-row align-items-center justify-content-start">
			<div class="col-2">
				<button v-if="!lancamentoEdit" id="btnCadastrarLancamento" class="btn btn-sm btn-primary" @click="CadastrarLancamento">Cadastrar</button>
				<button v-if="lancamentoEdit" id="btnEditarLancamento" class="btn btn-sm btn-primary" @click="EditarLancamento">Atualizar</button>
				&nbsp;
				<button v-if="lancamentoEdit" id="btnCancelarEdicao" class="btn btn-sm btn-outline-secondary" @click="CancelEdit">Cancelar</button>
			</div>
			<div class="col text-danger fw-bold" v-show="errorMessage">{{ errorMessage }}</div>
			<div class="col text-success fw-bold" v-show="successMessage">{{ successMessage }}</div>
		</div>

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
	</div>
</template>

<script>
import LancamentoModel from '../models/lancamento-model';
import JQUERY from 'jquery';
import { ReplaceValoresMoeda } from '../helpers/util';

export default {
	name: 'Home',
	components: {
		SelectCategoria: () => import('../components/SelectCategoria'),
		SelectSubCategoria: () => import('../components/SelectSubCategoria'),
		SelectConta: () => import('../components/SelectConta'),
		Lancamentos: () => import('../components/Lancamentos'),
		Loading: () => import('vue-loading-overlay'),
	},
	data() {
		return {
			model: new LancamentoModel(),
			errorMessage: '',
			successMessage: '',
			reload: false,
			filter: {
				ano: null,
				mes: null,
			},
			lancamentoEdit: null,
			isLoading: false,
		};
	},
	watch: {
		lancamentoEdit(_newVal) {
			if (_newVal) this.SetValuesToEdit();
		},
	},
	computed: {
		dateFilterFormatted() {
			if (!this.filter.mes) return '00/0000';
			const mes = `0${this.filter.mes}`;
			return `${mes.substring(String(mes).length, String(mes).length - 2)}/${this.filter.ano}`;
		},
		valorParcelado() {
			let valorParcelado = 'R$ 0,00';
			if (this.model.dividirValor) {
				valorParcelado = (parseFloat(ReplaceValoresMoeda(this.model.valor || 0)) / this.model.totalParcelas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			} else {
				valorParcelado = parseFloat(ReplaceValoresMoeda(this.model.valor || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
			}
			return valorParcelado;
		},
	},
	mounted() {
		const date = new Date();
		date.setMonth(date.getMonth() + 1);
		this.filter.ano = date.getFullYear();
		this.filter.mes = date.getMonth();
	},
	methods: {
		CancelEdit() {
			this.lancamentoEdit = null;
			this.model.ResetProps();
		},
		SetValuesToEdit() {
			this.model.lancamentoId = this.lancamentoEdit.lancamentoId;
			this.model.tipoLancamentoId = this.lancamentoEdit.tipoLancamentoId;
			this.model.dataLancamento = this.lancamentoEdit.dataLancamento;
			this.model.contaId = this.lancamentoEdit.contaId;
			this.model.contaIdDestino = this.lancamentoEdit.contaIdDestino;
			this.model.categoriaId = this.lancamentoEdit.categoriaId;
			this.model.subCategoriaId = this.lancamentoEdit.subCategoriaId;
			this.model.valor = this.lancamentoEdit.valor;
			this.model.quitado = this.lancamentoEdit.quitado;

			this.FormataValor();
		},
		FormataValor() {
			if (!this.model.valor) {
				this.model.valor = '0,00';
				return false;
			}

			let moneyToFormat = parseFloat(this.model.valor.toString().replace(/[^0-9]/g, ''));
			switch (moneyToFormat.toString().length) {
				case 1:
					moneyToFormat = parseFloat(`0.0${moneyToFormat}`);
					break;
				case 2:
					moneyToFormat = parseFloat(`0.${moneyToFormat}`);
					break;
				default:
					moneyToFormat = parseFloat(`${moneyToFormat.toString().slice(0, moneyToFormat.toString().length - 2)}.${moneyToFormat.toString().slice(-2)}`);
					break;
			}

			this.model.valor = moneyToFormat.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/[^0-9,.]/g, '');
		},
		AddMonth(_increment) {
			const date = new Date(this.filter.ano, this.filter.mes - 1, 1);
			date.setMonth(date.getMonth() + _increment);
			this.filter.ano = parseInt(date.toLocaleDateString('pt-BR').split('/')[2]);
			this.filter.mes = parseInt(date.toLocaleDateString('pt-BR').split('/')[1]);
		},
		async CadastrarLancamento() {
			const VALIDATE = await this.model.Validate();

			if (!VALIDATE.isValid) {
				this.errorMessage = VALIDATE.message;
				setTimeout(() => {
					this.errorMessage = '';
				}, 2000);
				return false;
			}

			this.model.nomeConta = JQUERY('#ddlConta option:selected').text();
			this.model.nomeCategoria = JQUERY('#ddlCategoria option:selected').text();
			this.model.nomeSubCategoria = this.model.subCategoriaId ? JQUERY('#ddlSubCategoria option:selected').text() : '';
			this.model.nomeContaDestino = parseInt(this.model.tipoLancamentoId) === 3 ? JQUERY('#ddlContaDestino option:selected').text() : null;

			this.isLoading = true;
			await this.model.InserirLancamento();
			this.isLoading = false;
			this.successMessage = 'Lançamento cadastrado';
			setTimeout(() => {
				this.successMessage = '';
			}, 1000);
			this.reload = true;
		},
		async EditarLancamento() {
			const VALIDATE = await this.model.Validate();

			if (!VALIDATE.isValid) {
				this.errorMessage = VALIDATE.message;
				setTimeout(() => {
					this.errorMessage = '';
				}, 2000);
				return false;
			}

			this.model.nomeConta = JQUERY('#ddlConta option:selected').text();
			this.model.nomeCategoria = JQUERY('#ddlCategoria option:selected').text();
			this.model.nomeSubCategoria = this.model.subCategoriaId ? JQUERY('#ddlSubCategoria option:selected').text() : '';
			this.model.nomeContaDestino = parseInt(this.model.tipoLancamentoId) === 3 ? JQUERY('#ddlContaDestino option:selected').text() : null;

			await this.model.EditarLancamento();
			this.successMessage = 'Lançamento atualizado';
			setTimeout(() => {
				this.successMessage = '';
			}, 1000);
			this.reload = true;
		},
	},
};
</script>
