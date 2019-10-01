'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const api = require('./routes/index_route');

const app = express();
//Esto es provisional
app.set('view engine', 'ejs'); //Cargando la vista
app.set('views', path.join(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
//----------------

//Sirve para acceder al cuerpo de las peticiones
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', api);

module.exports = app