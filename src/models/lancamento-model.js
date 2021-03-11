import SERVICE from '../services/lancamento-service';
import { v4 as uuidv4 } from 'uuid';

import { ReplaceValoresMoeda } from '../helpers/util';

export default class LancamentoModel {
	constructor() {
		this.tiposLancamento = { 1: 'Receita', 2: 'Despesa' };
		this.lancamentoId = null;
		this.tipoLancamentoId = null;
		this.dataLancamento = null;
		this.contaId = null;
		this.nomeConta = null;

		this.contaIdDestino = null;
		this.nomeContaDestino = null;

		this.categoriaId = null;
		this.nomeCategoria = null;
		this.subCategoriaId = null;
		this.nomeSubCategoria = null;
		this.valor = null;
		this.quitado = false;

		this.parcela = null;
		this.totalParcelas = null;

		this.dividirValor = false;
	}

	ResetProps() {
		this.lancamentoId = null;
		this.tipoLancamentoId = null;
		this.dataLancamento = null;
		this.contaId = null;
		this.nomeConta = null;
		this.contaIdDestino = null;
		this.nomeContaDestino = null;
		this.categoriaId = null;
		this.nomeCategoria = null;
		this.subCategoriaId = null;
		this.nomeSubCategoria = null;
		this.valor = null;
		this.quitado = false;
		this.parcela = null;
		this.totalParcelas = null;
		this.dividirValor = false;
	}

	Validate() {
		return new Promise(resolve => {
			if (!this.tipoLancamentoId) {
				resolve({ isValid: false, message: 'Informe o tipo do lançamento' });
			}

			if (!this.dataLancamento) {
				resolve({ isValid: false, message: 'Informe a data de lançamento' });
			}

			if (!this.contaId) {
				resolve({ isValid: false, message: 'Informe a conta' });
			}

			if (parseInt(this.tipoLancamentoId) === 3 && !this.contaIdDestino) {
				resolve({ isValid: false, message: 'Informe a conta de destino da transferência' });
			}

			if (parseInt(this.tipoLancamentoId) === 3 && parseInt(this.contaId) === parseInt(this.contaIdDestino)) {
				resolve({ isValid: false, message: 'A conta de destino deve ser diferente da conta de origem' });
			}

			if (!this.categoriaId) {
				resolve({ isValid: false, message: 'Informe a categoria' });
			}

			if (!this.valor) {
				resolve({ isValid: false, message: 'Informe o valor' });
			}

			resolve({ isValid: true, message: '' });
		});
	}

	GetModel() {
		return {
			dataLancamento: this.dataLancamento,
			tipoLancamentoId: parseInt(this.tipoLancamentoId),
			tipoLancamento: this.tiposLancamento[parseInt(this.tipoLancamentoId)],
			ano: parseInt(this.dataLancamento.split('-')[0]),
			mes: parseInt(this.dataLancamento.split('-')[1]),
			contaId: parseInt(this.contaId),
			conta: this.nomeConta || '',
			contaIdDestino: parseInt(this.tipoLancamentoId) === 3 ? parseInt(this.contaIdDestino) : null,
			contaDestino: parseInt(this.tipoLancamentoId) === 3 ? this.nomeContaDestino : null,
			categoriaId: parseInt(this.categoriaId),
			categoria: this.nomeCategoria || '',
			subCategoriaId: parseInt(this.subCategoriaId) || null,
			subCategoria: this.nomeSubCategoria || '',
			valor: parseFloat(ReplaceValoresMoeda(this.valor)) || 0,
			valorOrignal: parseInt(this.tipoLancamentoId) === 2 ? -1 * parseFloat(ReplaceValoresMoeda(this.valor)) : parseFloat(ReplaceValoresMoeda(this.valor)),
			quitado: false,
			vinculoLancamentoOrigem: uuidv4(),
			parcela: null,
			totalParcelas: null,
		};
	}

	async InserirLancamento() {
		try {
			const MODEL_CADASTRO = this.GetModel();

			if (this.totalParcelas) {
				MODEL_CADASTRO.totalParcelas = this.totalParcelas;
				if (this.dividirValor) MODEL_CADASTRO.valor = parseFloat(ReplaceValoresMoeda((MODEL_CADASTRO.valor / MODEL_CADASTRO.totalParcelas).toFixed(2)));
				if (this.dividirValor) MODEL_CADASTRO.valorOrignal = parseFloat(ReplaceValoresMoeda((MODEL_CADASTRO.valorOrignal / MODEL_CADASTRO.totalParcelas).toFixed(2)));
				for (let parcela = 0; parcela < parseInt(MODEL_CADASTRO.totalParcelas); parcela++) {
					if (parcela) {
						const arrayData = this.dataLancamento.split('-').map(Number);
						const date = new Date(arrayData[0], parseInt(arrayData[1]) - 1, arrayData[2]);
						date.setMonth(date.getMonth() + parcela);

						MODEL_CADASTRO.ano = parseInt(date.getFullYear());
						MODEL_CADASTRO.mes = parseInt(date.getMonth() + 1);
						MODEL_CADASTRO.dataLancamento = date
							.toLocaleDateString('pt-BR')
							.split('/')
							.reverse()
							.join('-');
					}
					MODEL_CADASTRO.parcela = parcela + 1;
					await SERVICE.PostLancamento(MODEL_CADASTRO);
				}
			} else {
				await SERVICE.PostLancamento(MODEL_CADASTRO);
			}
			this.ResetProps();
		} catch (error) {
			console.log(error);
		}
	}

	async EditarLancamento() {
		try {
			const MODEL_EDICAO = this.GetModel();
			await SERVICE.PutLancamento(this.lancamentoId, MODEL_EDICAO);
			this.ResetProps();
		} catch (error) {
			console.log(error);
		}
	}
}
