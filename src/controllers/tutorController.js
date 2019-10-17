'use strict'

const Student = require('../models/student');
const service = require('../services/index_services');


async function registerTutor(req, res){
    
    const id_student = req.student;

    const addFields = {
        courses: [],
        description: req.body.description,
        isTutor: true,
        dateCreatedTutor: new Date()
    };

    Student.findOneAndUpdate({_id:id_student}, addFields, (err, result)=>{
        if (err) return res.status(500).send({message: 'Server Failed'});
        res.send(result);
    });
    
}

async function addCourseTutor(req, res){
    
}







module.exports = { registerTutor}
