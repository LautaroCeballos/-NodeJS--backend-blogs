'use strict';

require('dotenv').config()

var mongoose = require('mongoose');
var	app = require('./app');
var	port = process.env.PORT;

const user = process.env.USER;
const password = process.env.PASSWORD;
const dbname = process.env.DBNAME;

const uri = `mongodb+srv://${user}:${password}@blog-database.i95md.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.set('useFindAndModify', false); //Para desactivar la forma de trabajar antigua y usar nuevos metodos
mongoose.Promise = global.Promise;
//Con promesas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('La conexion ha sido exitosa');

		//Crear servidor y ponerme a escuchar peticiones http
		app.listen(port, () => {
			console.log('Servidor corriendo en http://localhost:' + port);
		});
	});