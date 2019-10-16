'use strict'

const mongoose = require('mongoose');
const Student = require('../models/student');
const service = require('../services/index_services');


//Registro
async function signUp(req, res){
    const student = new Student({
        name : req.body.name,
        lastName : req.body.lastName,
        email: req.body.email,
        password : req.body.password,
        career: req.body.carrer,
        gpa:req.body.gpa,
        phoneNumber: req.body.phoneNumber
    });
    const existingStudent = await Student.findOne({email:student.email});

    if (existingStudent) {

        return res.status(400).send({message: 'User already exist'});
    } else {
        student.save((err)=>{
            if (err) res.status(500).send({message: `Error creating user: ${err}`});
            
            //Código original - funcional
            //return res.status(200).send({token: service.createToken(student)})
            return res.status(200).send({message: 'User registered sucessfully'});
        });
    }

}

//Login
function signIn(req, res){
    Student.findOne({email:req.body.email}, (err, student)=>{
        if (err) return res.status(500).send({message: 'Server Failed'});

        if(!student) return res.status(404).send({message: 'User does not exist'});
        
        if(student.comparePassword(req.body.password)){
            res.status(200).send({
                message: 'Te has logueado correctamente',
                token: service.createToken(student)
            });
        }  else {
            res.status(400).send({
                message: 'Contraseña incorrecta'
            });
        }    
    });
}


//Obtener estudiante
function getStudent(req, res){
    Student.findOne({_id:req.student}, (err, student) =>{
        if (err) return res.status(500).send({message: 'Server Failed'});

        if(!student) return res.status(404).send({message: 'User does not exist'});

        res.status(200).send({
            name:student.name,
            lastName: student.lastName,
            email:student.email,
            career: student.career,
            gpa:student.gpa,
            phoneNumber: student.phoneNumber
        });
    });
}



//Provisional
function getAllStudents(req, res){
    Student.find({}, (err, students)=>{
        if (err) return res.status(500).send({message: 'Server Failed'});

        res.status(200).send(students);
    });
}

module.exports = {
    signUp,
    signIn,
    getStudent,
    getAllStudents
}
