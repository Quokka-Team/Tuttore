'use strict'

const express = require('express');
const bodyParser = require('body-parser');



const app = express();

//Sirve para acceder al cuerpo de las peticiones
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());




module.exports = app