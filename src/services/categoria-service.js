import api from './firebase';

export default class CategoriaService {
	static #apiRef = api.collection('categorias');
	constructor() {}

	static async GetCategorias() {
		if (!localStorage.getItem('categorias')) {
			const RESPONSE = await this.#apiRef.orderBy('nome').get();
			const categorias = RESPONSE.docs.map(doc => doc.data());
			localStorage.setItem('categorias', JSON.stringify(categorias));
			return categorias;
		}
		return JSON.parse(localStorage.getItem('categorias'));
	}

	PostCategorias() {
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
