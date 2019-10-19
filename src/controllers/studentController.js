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
        phoneNumber: req.body.phoneNumber,
        isTutor: false
    });
    let existingStudent;
    try{
        existingStudent = await Student.findOne({email:student.email});
    }
    catch(err){
        res.status(500).send({message:'Error server validation', err:err})
    }    


    if (existingStudent) {
        return res.status(403).send({message: 'User already exist'});
    } else {
        student.save((err)=>{
            if (err) res.status(500).send({message: `Error creating user`, err:err});
            
            return res.status(201).send({message: 'User registered sucessfully'});
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
                message: 'You have successfully logged in',
                token: service.createToken(student)
            });
        }  else {
            res.status(400).send({message: 'Incorrect password'});
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
