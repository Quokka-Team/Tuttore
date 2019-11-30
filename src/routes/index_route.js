'use strict'

const express = require('express');
const StudentController = require('../controllers/studentController');
const emailNotificationController = require('../controllers/emailNotificationController');
const CourseController = require('../controllers/courseController');
const TutorController = require('../controllers/tutorController');
const CareerController = require('../controllers/careerController');
const PictureController = require('../controllers/pictureController');
const auth = require('../middlewares/auth');
const googleAuth = require('../middlewares/googleAuth');

const api = express.Router();

//Ruta de Bienvenida
api.get('/', (req, res) => {
    res.status(200).send({message:"You are on the '/' route with the get method"});
});

//Ruta para realizar registro
api.post('/signUp', StudentController.signUp);

//Ruta para loguearse
api.post('/signIn', StudentController.signIn);

//Ruta de Prueba
api.get('/profile', auth, (req, res) => {
    res.status(200).send("You are on the '/ profile' route with the get method and it has authenticated you");
});

//Obitene los datos del estudiante, se requiere autentificacion
api.get('/getStudent', auth, StudentController.getStudent);

api.put('/updateStudent', auth, StudentController.updateStudent);

api.get('/typeStudent/:email', StudentController.typeStudent);


//Permite anadir un curso'
api.post('/addCourse', CourseController.addCourse);

// Obetener todos los tutores
api.get('/getAllCourses', CourseController.getAllCourses);

// Obtener los n cursos mas nuevos
api.get('/getNewCourses/:numberCourses', CourseController.getNewCourses);



// agregar una carrera
api.post('/AddCareer', CareerController.addCareer);

// Obtener todas las carreras
api.get('/getAllCareers', CareerController.getAllCareers);



//Agregar tutor
api.post('/registerTutor', auth, TutorController.registerTutor);

//Agregar un nuevo curso
api.post('/addCourseTutor', auth, TutorController.addCourseTutor);

//Obtener Tutor
api.get('/getTutor/:idTutor', auth, TutorController.getTutor);

//Obtener Tutores por materia
api.get('/getTutorsByCourse/:idCourse', TutorController.getTutorsByCourse);

//Get new tutors
api.get('/getNewTutors/:numberTutors', TutorController.getNewTutors);

//Add new event to a tutor
api.post('/addEventTutor', auth, TutorController.addEventTutor);

//Delete an event of a tutor
api.post('/deleteEventTutor', auth, TutorController.deleteEventTutor);

//Get all events of a tutor
api.get('/getEventsTutor/:idTutor', TutorController.getEventsTutor);

api.post('/updateEventTutor', TutorController.updateEventTutor);

//Get new tutors by course
api.get('/getNewTutorsByCourse/:idCourse/:numberTutors', TutorController.getNewTutorsByCourse);

//Envia codigo de verificacion
api.get('/verificationCode/:email', emailNotificationController.sendCodeVerification);


//Provisional
api.get('/getAllStudents', StudentController.getAllStudents);



//COmentar - Arreglar
api.get('/getStudentProfilePicture/:idProfilePicture', StudentController.getStudentProfilePicture)

api.get('/getPicture/:idPicture', PictureController.getPicture)




//Google Auth
api.post('/signUpGoogle', googleAuth, StudentController.signUpGoogle);
api.post('/signInGoogle', googleAuth, StudentController.signInGoogle);

module.exports = api;