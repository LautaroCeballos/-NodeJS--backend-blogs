'use strict';

var express = require('express');
var ArticleController = require('../controllers/article.js');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/articles'}); //es un middleware para upload

//Rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);

//Rutas para articulos
router.get('/', ArticleController.default)
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles); //Con el signo de pregunta es un parametro opcional
router.get('/article/:id', ArticleController.getArticle); //id es un parametro obligatorio
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id?', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);
//post: Para guardar datos en la base de datos
//get: Para sacar datos de la base de datos
//put: para actualizar datos en la base de datos
//delete: para eliminar datos en la base de datos


module.exports = router;