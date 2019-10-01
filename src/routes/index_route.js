'use strict'

const express = require('express');
const StudentController = require('../controllers/studentController');


const auth = require('../middlewares/auth');


const api = express.Router();

api.get('/', (req, res) =>{
    res.render("login");
});

api.post('/', (req, res) =>{
    res.send('Holimolis');
});

api.post('/signup', StudentController.signUp);

api.post('/signin', StudentController.signIn);

api.get('/profile', auth,  (req, res) =>{
    res.send('Holimolis-profile');
});


module.exports = api;