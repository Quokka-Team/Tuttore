'use strict'

const Student = require('../models/student');
const service = require('../services/index_services');
const Course = require('../models/course');




async function registerTutor(req, res){
    
    const id_student = req.student;

    const addFields = {
        courses: [],
        description: req.body.description,
        isTutor: true,
        dateCreatedTutor: new Date()
    };

    Student.update({_id:id_student}, addFields, (err, result)=>{
        if (err) return res.status(500).send({message: 'Server Failed'});
        res.send(result);
    });
    
   
}

async function addCourseTutor(req, res){

    const id_tutor = req.student;
    const id_course = req.body.idCourse;

    const newCourse ={
        courseId: id_course,
        gpa:0,
        score:0,
        initialDate: new Date()
    }

    const newTutor = {
        initialDate: new Date(),
        tutor: id_tutor,
        gpa:0,
        score:0
    }


    Student.findOne({_id:id_tutor}, (err, student) =>{
        
        if (err) return res.status(500).send({message: 'Server Failed'});
        student.courses.push(newCourse);

        Student.update({_id:id_tutor}, {courses:student.courses}, (err, result)=>{
            if (err) return res.status(500).send({message: 'Server Failed'});
            
            Course.findOne({_id:id_course}, (err, course) =>{

                if (err) return res.status(500).send({message: 'Server Failed'});
                course.avaibleTutors.push(newTutor);
        
                Course.update({_id:id_course}, {avaibleTutors:course.avaibleTutors}, (err, result)=>{

                    if (err) return res.status(500).send({message: 'Server Failed'});
                    res.send("OK");

                });
            });
        });

    });
}



async function getTutor(req, res){
    let idTutor;
    if(req.body.idTutor == 'this'){
        idTutor = req.student;
    }
    else{
        idTutor = req.body.idTutor;
    }

    //Callback - funciona de manera parcial
    // let tutor;

    // await Student.findOne({_id:idTutor}, (err, result) =>{
    //     if (err) return res.status(500).send({message: 'Server Failed'});

    //     if(!result) return res.status(404).send({message: 'User does not exist'});

    //     if(!result.isTutor) return res.status(404).send({message: 'Yutor does not exist'});
        
    //     tutor = result;
        
    // });

    // let tutor;
    

    //Promise no funciona
    // Student.findOne({_id:idTutor}).exec()
    //     .then(response =>{
    //         if(!response) return res.status(404).send({message: 'User does not exist'});

    //         if(!response.isTutor) return res.status(404).send({message: 'Yutor does not exist'});
            
    //         tutor = response;
    //     })
    //     .catch( err =>{
    //         if (err) return res.status(500).send({message: 'Server Failed', err});
    //     });
    
    // add try catch

    let tutor;
    try{
        tutor = await Student.findOne({_id:idTutor}).exec();
    }
    catch(error){
        res.send(error);
    }
    
    let newTutor = {
        name: tutor.name,
        lastName: tutor.lastName,
        email: tutor.email,
        career: tutor.career,
        gpa: tutor.gpa, 
        phoneNumber: tutor.phoneNumber,
        description: tutor.description,
        dateCreatedTutor: tutor.dateCreatedTutor,
        courses:[]
    }
    
    // add try catch
    newTutor.courses = await getInformationCourses(tutor.courses);

    res.send(newTutor);

}

//Funcion auxiliar de get tutor
async function getInformationCourses(idCourses){
    let courses =[];
    for(let i = 0; i<idCourses.length; i++){
        let id_course = idCourses[i].courseId;
        let course = await Course.findOne({_id:id_course}).exec();
        let newCourse = {
            idCourse: id_course,
            name: course.name,
            code: course.code,
            gpa: idCourses[i].gpa,
            score: idCourses[i].score
        }
        courses.push(newCourse);
    }
    return courses;
}




async function getTutorsByCourse(req, res){
    let id_course = req.body.idCourse;

    let course;


    //Callback - funciona parcialmente
    // await Course.findOne({_id:id_course}, (err, result)=>{
    //     if (err) return res.status(500).send({message: 'Server Failed'});

    //     if(!result) return res.status(404).send({message: 'Course does not exist'});

    //     course = result;
    // });
    
    try{
        course = await Course.findOne({_id:id_course}).exec();
    }
    catch(error){
        res.send(error);
    }
    let getCourse = {
        idCourse:id_course,
        name:course.name,
        code: course.code,
        avaibleTutors:[]
    }
    getCourse.avaibleTutors = await getInformationTutors(course.avaibleTutors);

    res.send(getCourse);

}


async function getInformationTutors(getTutors){
    let tutors = [];
    for(let i = 0; i<getTutors.length; i++){
        let tutor = await Student.findOne({_id:getTutors[i].tutor}).exec();
        tutors.push({
            idTutor: tutor.id,
            name: tutor.name,
            lastName: tutor.lastName,
            carrer: tutor.carrer,
            description: tutor.description,
            initialDate:getTutors[i].initialDate,
            gpa: getTutors[i].gpa,
            score: getTutors[i].score
        });
    }
    return tutors;
}



async function getNewTutors(req, res){
    let tutors = await Student.find({isTutor: true}).sort({dateCreatedTutor:'desc'}).limit(5).exec();
    res.send(tutors);
}


async function getNewTutorsByCourse(req, res){
    let course = await Course.findOne({_id:req.body.idCourse}).exec();
    let idTutors =[];
    for(let i=0; i<course.avaibleTutors.length; i++){
        idTutors.push({ 
                        id:course.avaibleTutors[i].tutor, 
                        initialDate:course.avaibleTutors[i].initialDate,
                        gpa: course.avaibleTutors[i].gpa,
                        score: course.avaibleTutors[i].score 
                    });
    }

    idTutors.sort(function(a, b){
        if(a.initialDate<b.initialDate){return 1;}
        if(a.initialDate>b.initialDate){return -1;}
        return 0;
    });
    idTutors = idTutors.slice(0,5);

    let tutors = [];
    for(let i = 0; i<idTutors.length; i++){
        let tutor = await Student.findOne({_id:idTutors[i].id}).exec();
        tutors.push({
            idTutor: tutor.id,
            name: tutor.name,
            lastName: tutor.lastName,
            email: tutor.email,
            carrer: tutor.carrer,
            description: tutor.description,
            initialDate:idTutors[i].initialDate,
            gpa: idTutors[i].gpa,
            score: idTutors[i].score
        });
    }
    
    res.send(tutors);

}



module.exports = { registerTutor, addCourseTutor, getTutor, getTutorsByCourse, getNewTutors, getNewTutorsByCourse}
