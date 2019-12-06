'use strict'

const mongoose = require('mongoose');
const Session = require('../models/session');
const Course  = require('../models/course');
const Student = require('../models/student');

async function addRequest(req, res){
    
    //Recuperando Datos del tutor
    let tutor;
    try{
        tutor = await Student.findOne({_id:req.body.idTutor}).exec();
    }
    catch(err){
        res.status(500).send({
            message: 'error getting tutor',
            err: err
        });
    }

    //Recuperando Datos del Estudiante
    let student;
    try{
        student = await Student.findOne({_id:req.body.idStudent}).exec();
    }
    catch(err){
        res.status(500).send({
            message: 'error getting student',
            err: err
        });
    }

    //Recuperando Materia
    let course;
    try{
        course = await Course.findOne({_id:req.body.idCourse}).exec();
    } 
    catch(err){
        res.status(500).send({
            message: 'error getting course',
            err: err
        });
    }

    res.send('Washo');

    // const newEvent ={
    //     title: req.body.title,
    //     start: req.body.start,
    //     color: req.body.color,
    //     textColor: req.body.textColor,
    //     overlap: req.body.overlap,
    //     selectable: req.body.selectable
    // };

}

module.exports = { 
    addRequest
}