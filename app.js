'use strict';

//Cargar modulos de node para crear el servidor
var express = require('express');
var	bodyParser = require('body-parser');

//Ejecutar express (http)
var app = express();

//Cargar ficheros rutas

var article_routes = require('./routes/article');

//Middlewares
app.use(bodyParser.urlencoded({extended:false})); //Inicializacion del body parser
app.use(bodyParser.json()); //convertir los datos que lleguen a formato json

//CORS (Middlewares) Permite las llamadas http desde cualquier frontend
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Añadir prefijos a rutas / Cargar rutas

app.use('/api', article_routes);

/*
// Ruta o metodo de prueba para el API REST
	app.get('/probando', (req, res) => {
		console.log(req.body);

		return res.status(200).send({
			curso: 'Master en frameworks js',
			nombre: 'Lautaro Ceballos',
			email: 'admin@admin.com'
		});
	});
*/

//Exportar modulos (fichero actual)

module.exports = app;