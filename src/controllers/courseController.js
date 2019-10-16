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
        if (err) res.status(500).send({message: `Error adding the course: ${err}`});

        return res.status(200).send({message: 'Course succesfully added'});
    });
}


//Provisional
async function getAllCourses(req, res){
    Course.find({}, (err, courses)=>{
        if (err) return res.status(500).send({message: 'Server Failed'});

        res.status(200).send(courses);
    });
}

async function getNewCourses(req, res){
    let numberOfNewCourses = 2;
    Course.find({}).sort({dateCreated: 'asc'}).limit(numberOfNewCourses).exec( (err, courses) => {
        if (err) return res.status(500).send({message: 'Server Failed'});
        
        res.status(200).send(courses);
    });
}


module.exports = {
    addCourse,
    getAllCourses,
    getNewCourses
}