import firebase from 'firebase/app';
import 'firebase/firestore';

firebase.initializeApp({
	apiKey: 'AIzaSyAZwhdf8WwvhGBq9dcpLHlmMXnqde4iHQY',
	authDomain: 'saldo-positivo.firebaseapp.com',
	projectId: 'saldo-positivo',
});

const api = firebase.firestore();

export default api;
