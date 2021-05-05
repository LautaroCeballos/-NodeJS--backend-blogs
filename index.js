'use strict';

var mongoose = require('mongoose');
var	app = require('./app');
var	port = process.env.PORT || 3900;

const user = 'admin';
const password = 'OJIeZQpa4JVOTkbu';
const dbname = "api-rest-blog"
const uri = `mongodb+srv://${user}:${password}@blog-database.i95md.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.set('useFindAndModify', false); //Para desactivar la forma de trabajar antigua y usar nuevos metodos
mongoose.Promise = global.Promise;
//Con promesas
mongoose.connect(uri, { useNewUrlParser: true })
	.then(() => {
		console.log('La conexion ha sido exitosa');

		//Crear servidor y ponerme a escuchar peticiones http
		app.listen(port, () => {
			console.log('Servidor corriendo en http://localhost:' + port);
		});
	});