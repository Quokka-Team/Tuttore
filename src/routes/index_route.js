'use strict'

const express = require('express');
const StudentController = require('../controllers/studentController');
const emailNotificationController = require('../controllers/emailNotificationController');
const CourseController = require('../controllers/courseController');
const TutorController = require('../controllers/tutorController');
const CareerController = require('../controllers/careerController');

const auth = require('../middlewares/auth');


const api = express.Router();

//Ruta de Bienvenida
api.get('/', (req, res) => {
    res.send("Estas en al ruta '/' con el metodo get ");
});

api.post('/', (req, res) => {
    res.send("Estas en al ruta '/' con el metodo post ");
});



//Ruta para realizar registro

api.get('/signUp', (req, res) => {
    res.send("Estas en al ruta '/signUp' con el metodo get");
});

api.post('/signUp', StudentController.signUp);


//Ruta para loguearse
api.get('/signIn', (req, res) => {
    res.send("Estas en al ruta '/singIn' con el metodo get");
});

api.post('/signIn', StudentController.signIn);


//Ruta de Prueba
api.get('/profile', auth, (req, res) => {
    res.send("Estas en al ruta '/profile' con el metodo get y te ha autentificado");
});


//Permite anadir un curso
api.get('/addCourse', CourseController.addCourse);


api.get('/getAllCourses', CourseController.getAllCourses);

api.get('/getNewCourses', CourseController.getNewCourses);

api.get('/AddCareer', CareerController.addCareer);


//Obitene los datos del estudiante, se requiere autentificacion
api.post('/getStudent', auth, StudentController.getStudent);


//Agregar tutor
api.post('/registerTutor', auth, TutorController.registerTutor);


//Obtener Tutor
api.post('/getTutor', auth, TutorController.getTutor);


//Agregar un nuevo curso
api.post('/addCourseTutor', auth, TutorController.addCourseTutor);





//Provisional - Envia codigo
api.get('/codeVerification', emailNotificationController.sendCodeVerification);


//Provisional
api.get('/getAllStudents', StudentController.getAllStudents);



module.exports = api;