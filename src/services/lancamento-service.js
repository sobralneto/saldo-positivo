import api from './firebase';

export default class LancamentoService {
	static #apiRef = api.collection('lancamentos');
	constructor() {}

	static async GetLancamentos() {
		const RESPONSE = await this.#apiRef.orderBy('nome').get();
		return RESPONSE.docs.map(doc => doc.data());
	}

	static async GetLancamentosByMonth({ ano, mes }) {
		try {
			const RESPONSE = await this.#apiRef
				.where('ano', '==', ano)
				.where('mes', '==', mes)
				.get();
			return RESPONSE.docs.map(doc => {
				let lancamento = doc.data();
				lancamento['lancamentoId'] = doc.id;
				return lancamento;
			});
		} catch (error) {
			console.error('Service: GetLancamentosByMonth => ', error);
		}
	}

	static async QuitarLancamento(_id, _quitado) {
		try {
			await this.#apiRef.doc(_id).update({ quitado: _quitado });
		} catch (error) {
			console.error('Service: QuitarLancamento => ', error);
		}
	}

	static async DeleteLancamento(_id) {
		try {
			await this.#apiRef.doc(_id).delete();
		} catch (error) {
			console.error('Service: DeleteLancamento => ', error);
		}
	}

	static async PostLancamento(_objetoLancamento) {
		try {
			const RESPONSE = await this.#apiRef.add(_objetoLancamento);
			return RESPONSE.id;
		} catch (error) {
			console.error('Service: PostLancamento => ', error);
		}
	}

	static async PutLancamento(_id, _objetoLancamento) {
		try {
			await this.#apiRef.doc(_id).update(_objetoLancamento);
		} catch (error) {
			console.error('Service: PostLancamento => ', error);
		}
	}
}
