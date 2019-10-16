'use strict'

const mongoose = require('mongoose');
const Course = require('../models/course');



async function addCourse(req, res){
    const dateNow = new Date();
    const course = new Course({
        name:req.body.name,
        code:req.body.code,
        dateCreated:dateNow
    });
    course.save((err)=>{
        if (err) res.status(500).send({message: `Error al agregar la materia: ${err}`});

        return res.status(200).send({message: 'Materia agregada de manera correcta'});
    });
}

module.exports = {addCourse}