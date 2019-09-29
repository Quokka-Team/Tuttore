'use strict'

const mongoose = require('mongoose');
const Student = require('../models/student');
//const service = require('../services');



function signUp(req, res){
    const student = new Student({
        name : req.body.name,
        lastName : req.body.lastName,
        email: req.body.email,
        password : req.body.password
    });

    student.save((err)=>{
        if (err) res.status(500).send({message: `Error al crear el usuario: ${err}`});
            // return res.status(200).send({token: service.createToken(student)});
            return res.status(200).send('mon amour');
    });
}

module.exports = {
    signUp
}
