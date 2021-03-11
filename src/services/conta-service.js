import api from './firebase';

export default class ContaService {
	static #apiRef = api.collection('contas');
	constructor() {}

	static async GetContas() {
		if (!localStorage.getItem('contas')) {
			const RESPONSE = await this.#apiRef.orderBy('nome').get();
			const contas = RESPONSE.docs.map(doc => doc.data());
			localStorage.setItem('contas', JSON.stringify(contas));
			return contas;
		}
		return JSON.parse(localStorage.getItem('contas'));
	}

	PostContas() {
		return false;
		/*api
			.collection('categorias')
			.add({ categoriaId: 3, nome: 'Saúde' })
			.then(docRef => {
				console.log('Document written with ID: ', docRef.id);
			})
			.catch(error => {
				console.error('Error adding document: ', error);
			});*/
	}
}
