'use strict'

const express = require('express');
const StudentController = require('../controllers/studentController');
const emailNotificationController = require('../controllers/emailNotificationController');

const auth = require('../middlewares/auth');


const api = express.Router();

api.get('/', (req, res) => {
    res.send("Estas en al ruta '/' con el metodo get ");
});

api.post('/', (req, res) => {
    res.send("Estas en al ruta '/' con el metodo post ");
});



api.get('/signUp', (req, res) => {
    res.send("Estas en al ruta '/signUp' con el metodo get");
});

api.post('/signUp', StudentController.signUp);



api.get('/signIn', (req, res) => {
    res.send("Estas en al ruta '/singIn' con el metodo get");
});

api.post('/signIn', StudentController.signIn);


api.get('/profile', auth, (req, res) => {
    res.send("Estas en al ruta '/profile' con el metodo get y te ha autentificado");
});



api.post('/codeVerification', emailNotificationController.sendCodeVerification);


module.exports = api;