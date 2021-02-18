'use strict';

var mongoose = require('mongoose');
var	app = require('./app');
var	port = 3900;

mongoose.set('useFindAndModify', false); //Para desactivar la forma de trabajar antigua y usar nuevos metodos
mongoose.Promise = global.Promise;
//Con promesas
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true })
	.then(() => {
		console.log('La conexion ha sido exitosa');

		//Crear servidor y ponerme a escuchar peticiones http
		app.listen(port, () => {
			console.log('Servidor corriendo en http://localhost:' + port);
		});
	});