'use strict'

const mongoose = require('mongoose');
const Student = require('../models/student');
const service = require('../services/index_services');



async function signUp(req, res){
    const student = new Student({
        name : req.body.name,
        lastName : req.body.lastName,
        email: req.body.email,
        password : req.body.password
    });
    const existingStudent = await Student.findOne({email:student.email});

    if (existingStudent) {

        return res.status(400).send({message: 'El usuario ya existe'});
    } else {
        student.save((err)=>{
            if (err) res.status(500).send({message: `Error al crear el usuario: ${err}`});
            
            return res.status(200).send({token: service.createToken(student)});
        });
    }

}


function signIn(req, res){
    Student.findOne({email:req.body.email}, (err, student)=>{
        if (err) return res.status(500).send({message: 'Servidor Failed'});

        if(!student) return res.status(404).send({message: 'NO existe el usuario'});
        
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

module.exports = {
    signUp,
    signIn
}
