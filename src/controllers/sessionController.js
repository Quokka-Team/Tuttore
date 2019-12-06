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




    //Creando session
    const newEvent ={
        title: `Tutoria - ${course.name}`,
        start: req.body.dateStart,
        color: '#096682',
        textColor: 'White',
        overlap: false,
        selectable: true
    };

    const session = new Session({
        tutor: req.body.idTutor,
        student: req.body.idStudent,
        course: req.body.idCourse,
        date: newEvent, 
        status: '0'
    });

    session.save((err)=>{
        if (err) res.status(500).send({message: `Error add request`, err:err});
            
        return res.status(201).send({message: 'Requets add sucessfully'});
    });
    
}

module.exports = { 
    addRequest
}