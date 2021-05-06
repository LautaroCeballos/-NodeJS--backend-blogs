'use strict';

var validator = require('validator');
var Article = require('../models/article.js');
var fs = require('fs'); //fileSystem permite eliminar archivos de nuestro sistema de ficheros (Pertenece a Nodejs)
var path = require('path'); //sirve para obtener la ruta o direccion de un archivo dentro del servidor (Pertebece a Nodejs)
var controller = {
	
	//Metodos de prueba
	datosCurso: (req, res) => {

		return res.status(200).send({
			curso: 'Master en frameworks js',
			nombre: 'Lautaro Ceballos',
			email: 'admin@admin.com'
		});
	},

	test: (req, res) => {
		return res.status(200).send({
			message: 'Soy la accion test del controller'
		});
	},

	default: (req, res) => {
		return res.status(200).send({
			status: 'success',
			message: 'A la escucha de peticiones'			
		})
	},

	//Metodos de utilidad
	save: (req, res) => {
		//Recoger parametros por post
		var params = req.body;

		//Validar datos (validator)
		try{
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
		}catch(err){
			return res.status(404).send({
				status: 'error',
				message: 'Faltan datos por enviar? !!!',
				err
			});
		}

		if(validate_title && validate_content){
			
			//Crear el objeto a guardar
			var article = new Article();

			//Asignar valores
			article.title = params.title;
			article.content = params.content;
			article.image = params.image;
			

			//Guardar el articulo
			article.save((err, articleStored) => {
				if(err || !articleStored){
					return res.status(500).send({
						status: 'error',
						message: 'El articulo no se ha guardado!!'
					});
				}
				//Devolver una respuesta
				return res.status(200).send({
					status: 'success',
					article: articleStored
				});
			});
		}else{
			return res.status(200).send({
				status: 'error',
				message: 'Los datos no son validos !!!'
			});
		}
	},

	getArticles: (req, res) => {
		//Find

		var query = Article.find({});

		var last = req.params.last;

		if(last || last != undefined){
			query.limit(5);
		}

		query.sort('-_id').exec((err, articles) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'error al devolver los datos !!!'
				});
			}
			if(!articles){
				return res.status(404).send({
					status: 'error',
					message: 'No hay articulos para mostrar'
				});
			}

			return res.status(200).send({
				status: 'success',
				articles
			});
		});
	},

	getArticle: (req, res) => {
		// Recoger el id de la url
		var articleId = req.params.id;

		// Comprobar que existe
		if(!articleId || articleId == null){
			return res.status(404).send({
				status: 'error',
				message: 'No existe el articulo!!'
			});
		}

		// Buscar el articulo
		Article.findById(articleId, (err, article) => {
			if(err || !article){
				return res.status(500).send({
					status: 'error',
					message: 'Error al devolver los datos'
				});
			}

			// Devolverlo en json
			return res.status(200).send({
				status: 'sucess',
				article
			});
		});
	},

	update: (req, res) => {
		// Recoger el id del articulo por la url
		var articleId = req.params.id;


		// Recoger los datos que llegan por put
		var params = req.body;

		// console.log(params.title + ', ' + params.content);
		// Validar datos
		try{
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
		}catch(err){
			return res.status(500).send({
				status: 'error',
				message: 'Faltan datos por enviar'
			});
		}

		if(validate_title && validate_content){
			// Find and Update
			Article.findOneAndUpdate({_id: articleId}, params, {new: true}, (err, articleUpdated) => {
				if(err){
					return res.status(500).send({
						status: 'error',
						message: 'Error al actualizar'
					});
				}

				if(!articleUpdated){
					return res.status(404).send({
						status: 'error',
						message: 'No exite el articulo'
					});
				}

				// Devilver respuesta
				return res.status(200).send({
					status: 'success',
					article: articleUpdated
				});
			});
		}else{
			return res.status(500).send({
				status: 'error',
				message: 'La validacion no es correcta !!'
			});
		}
	},

	delete: (req, res) => {
		// Recoger el id de la url
		var articleId = req.params.id;

		// Find and Delete
		Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'error al borrar'
				});
			}

			if(!articleRemoved){
				return res.status(404).send({
					status: 'error',
					message: 'No se ha encontrado el articulo'
				});
			}

			return res.status(200).send({
				status: 'success',
				aricle: articleRemoved
			});
		});	
	},

	upload: (req, res) => {
		// Configurar el Connect multiparty router/article.js (Hecho)

		// Recoger el fichero de la peticion
		var file_name = 'Imagen no subida...';

		if(!req.files){
			return res.status(404).send({
				status: 'error',
				message: file_name
			});
		}

		// Conseguir el nombre y la extencion del archivo
		var file_path = req.files.file0.path;
		var file_split = file_path.split('\\');
		// *El split funciona para separar la cadena mediante el punto de corte que se le indique ('\\')*

		// Nombre del archivo
		file_name = file_split[2];

		// Extencion del archivo
		var extension_split = file_name.split('\.');
		var file_ext = extension_split[1];

		// Comprobar la extencion, solo imagenes, si es valida borrar el fichero
		if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
			// borrar el archivo subido
			fs.unlink(file_path, (err) => { //nos permite eliminar un fichero
				return res.status(500).send({
					status: 'error',
					message: 'La extension de la image no es valida !!!'
				});
			}); 

			// Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
		}else{
			// Si es todo valido, sacando id de la url
			var articleId = req.params.id;

			if(articleId){
				// Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
				// *Busca en la base de datos 'articleId', le actualiza el nombre, y devuelve el objeto ya actualizado*
				Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (err, articleUpdated) => {
					if(err || !articleUpdated){
						return res.status(404).send({
							status: 'error',
							message: 'Error al guardar la imagen de articulo'
						});
					}
					return res.status(200).send({
						status: 'success',
						article: articleUpdated
					});
				});
			} else {
				return res.status(200).send({
					status: 'success',
					image: file_name
				});
			}
			
		}		
	},

	getImage: (req, res) => {
		var file = req.params.image;
		var path_file = './upload/articles/' + file;

		fs.exists(path_file, (exists) => {
			if(exists){
				return res.sendFile(path.resolve(path_file));
			}else{
				return res.status(404).send({
					status: 'error',
					message: 'La imagen no existe'
				});
			}
		});
	},

	search: (req, res) => {
		//Sacar el string a buscar
		var searchString = req.params.search;

		// Find or
		Article.find({"$or": [
			{"title": {"$regex" : searchString, "$options" : "i"}},
			{"content": {"$regex" : searchString, "$options" : "i"}}
			//Si el searchString esta contenido dentro de title o content entonces devuelve los articulos que coincidan
		]})
		.sort([['date', 'descending']])
		.exec((err, articles) => {
			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error en la peticion'
				});
			}
			if(!articles || articles.length <= 0){
				return res.status(404).send({
					status: 'error',
					message: 'No se encontraron resultados'
				});
			}
			return res.status(200).send({
				status: 'success',
				articles
			});
		});
		
	}
}; // end controller

module.exports = controller;