'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const api = require('./routes/index_route');

const app = express();
app.set('view engine', 'ejs'); //Cargando la vista
//Sirve para acceder al cuerpo de las peticiones
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', api);

module.exports = app