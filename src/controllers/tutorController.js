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
    const id_course = req.body.courseId;

    const newCourse ={
        courseId: id_course,
        gpa:0,
        score:0
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

    let tutor;


    await Student.findOne({_id:req.student}, (err, result) =>{
        if (err) return res.status(500).send({message: 'Server Failed'});

        if(!result) return res.status(404).send({message: 'User does not exist'});

        if(!result.isTutor) return res.status(404).send({message: 'Yutor does not exist'});
        
        tutor = result;
        
    });

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


module.exports = { registerTutor, addCourseTutor, getTutor}
