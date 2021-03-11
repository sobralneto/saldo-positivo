import api from './firebase';

export default class SubCategoriaService {
	static #apiRef = api.collection('subcategorias');
	constructor() {}

	static async GetSubCategorias() {
		if (!localStorage.getItem('subcategorias')) {
			const RESPONSE = await this.#apiRef.orderBy('nome').get();
			const subcategorias = RESPONSE.docs.map(doc => doc.data());
			localStorage.setItem('subcategorias', JSON.stringify(subcategorias));
			return subcategorias;
		}
		return JSON.parse(localStorage.getItem('subcategorias'));
	}

	PostSubCategorias() {
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
