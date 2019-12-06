'use strict'

const mongoose = require('mongoose');
let cron = require('node-cron');

const Session = require('../models/session');
const Course  = require('../models/course');
const Student = require('../models/student');

const EmailNotificationController = require('../controllers/emailNotificationController');



 
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

    //Recuperando Datos de la Materia
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



    //Guardando la solictud
    let idSession;

    try{
        let room = await session.save();
        idSession = room.id;
    }
    catch(err){
        res.status(500).send({message:'Error add request', err:err})
    }  



    //Programar verificacion del estado
    try{
        await scheduleVerification(req.body.dateStart, idSession);
    }
    catch(err){
        res.status(500).send({message:'Error schedule verification', err:err})
    }


    //Notificar por correo al tutor de la solicitud


    //Respondo solicitud
    res.status(201).send({message: 'Request add correctly'});

}



//Programar la verificacion
async function scheduleVerification(dateStartReq, idSession){

    //Definiendo la fecha
    let dateStart = {
        year:dateStartReq.substring(0,4),
        month:dateStartReq.substring(5,7),
        day:dateStartReq.substring(8,10),
        hour:String(parseInt(dateStartReq.substring(11,13)) - 5),
        minute:dateStartReq.substring(14,16),
        second:dateStartReq.substring(17,19)
    }
    let dateEnd = {
        year:dateStartReq.substring(0,4),
        month:dateStartReq.substring(5,7),
        day:dateStartReq.substring(8,10),
        hour:String(parseInt(dateStartReq.substring(11,13)) - 4),
        minute:dateStartReq.substring(14,16),
        second:dateStartReq.substring(17,19)
    }


    //Programando la funcion de validadion
    cron.schedule(`${dateStart.second} ${dateStart.minute} ${dateStart.hour} ${dateStart.day} ${dateStart.month} *`, async () => {

        //Obtiene la session
        let session;

        try{
            session = await Session.findOne({_id:idSession});
        }
        catch(err){
            throw "error getting session";
        }

        //Evalua el estado

        //Sin Respuesta
        if(session.status == '0'){
            //Cambiar estado -> 3) Solicitud vencida sin respuesta
            try{
                await Session.update({_id:idSession}, {status:'3'});
            }
            catch(err){
                throw "error update session";
            }

            //Notificar al usuario que la solicitud no obtuvo respuesta

        }



        //Aprovada
        else if(session.status == '1'){
            //Notificar por correo al usuario y tutor que tiene un tutoria


            //Programar una notificacion que la tutoria ha terminado
            cron.schedule(`${dateEnd.second} ${dateEnd.minute} ${dateEnd.hour} ${dateEnd.day} ${dateEnd .month} *`, async () => {
                
                //Notificar al usuario que la tutoria ha finalizado....

                
            });
        }
   
        //Otros casos
        else{
            //No hacer nada
        }

        console.log(session._id);
        console.log(session.status);
    }, 
    {
        scheduled: true,
        timezone: "America/Bogota"
    });

    return;

}




module.exports = { 
    addRequest
}