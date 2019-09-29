'use strict'

const express = require('express');
const StudentController = require('../controllers/studentController');


// const auth = require('../middlewares/auth');


const api = express.Router();

api.get('/', (req, res) =>{
    res.send('Holimolis');
});

api.post('/', (req, res) =>{
    res.send('Holimolis');
});

api.post('/signup', StudentController.signUp);


module.exports = api;