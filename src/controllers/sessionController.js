'use strict'

const mongoose = require('mongoose');
let cron = require('node-cron');

const Session = require('../models/session');
const Course  = require('../models/course');
const Student = require('../models/student');

const EmailNotificationController = require('../controllers/emailNotificationController');



//Añadir una solicitud del usuario
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
        end: req.body.dateEnd,
        color: '#096682',
        textColor: 'White',
        overlap: false,
        selectable: true
    };

    const session = new Session({
        tutor: req.body.idTutor,
        student: req.body.idStudent,
        course: req.body.idCourse,
        event: newEvent, 
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
        await scheduleVerification(req.body.dateStart, req.body.dateEnd, idSession);
    }
    catch(err){
        res.status(500).send({message:'Error schedule verification', err:err});
        return;
    }


    //Notificar por correo al tutor de la solicitud


    //Respondo solicitud
    res.status(201).send({message: 'Request add correctly'});

}







//Programar la verificacion
async function scheduleVerification(dateStartReq, dateEndReq, idSession){

    //Definiendo las fechas
    let dateStart = {
        year:dateStartReq.substring(0,4),
        month:dateStartReq.substring(5,7),
        day:dateStartReq.substring(8,10),
        hour:String(parseInt(dateStartReq.substring(11,13)) - 5),
        minute:dateStartReq.substring(14,16),
        second:dateStartReq.substring(17,19)
    }

    let dateEnd = {
        year:dateEndReq.substring(0,4),
        month:dateEndReq.substring(5,7),
        day:dateEndReq.substring(8,10),
        hour:String(parseInt(dateEndReq.substring(11,13)) - 5),
        minute:dateEndReq.substring(14,16),
        second:dateEndReq.substring(17,19)
    }


    //Programando la funcion de validadion
    cron.schedule(`${dateStart.second} ${dateStart.minute} ${parseInt(dateStart.hour)} ${dateStart.day} ${dateStart.month} *`, async () => {

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
        //Otros casos
        else{
            //No hacer nada
        }
    }, 
    {
        scheduled: true,
        timezone: "America/Bogota"
    });

    return;

}

















// Resolver solicitud
async function acceptRequest(req, res){
    let idSession = req.params.idSession;


    //Obteniendo datos de la sesion
    let session;
    try{
        session = await Session.findOne({_id:idSession});
    }
    catch(err){
        res.status(500).send({message:'Error getting session', err:err})
    }


    //Verificando el estado de la solicitud
    if(session.status != '0'){
        res.status(500).send({message:'Error request invalide'});
        
    }


    //Obteniendo las sesiones del tutor
    let tutor_sessions;

    try{
        tutor_sessions = await Session.find({tutor:session.tutor, status:'0'});
    }
    catch(err){
        res.status(500).send({message:'Error getting sessions tutor', err:err})
    }


    //seleccionado las sessiones con las que interfiere el horario
    let i=0;
    let idSessions_interception = [];

    while(tutor_sessions[i]){
        if(idSession != tutor_sessions[i]._id){
            if(session.event.start.substring(0,10) == tutor_sessions[i].event.start.substring(0,10)){
                let dateStart_a = parseInt(`${session.event.start.substring(11,13)}${session.event.start.substring(14,16)}`);
                let dateEnd_a = parseInt(`${session.event.end.substring(11,13)}${session.event.end.substring(14,16)}`);
                let dateStart_b = parseInt(`${tutor_sessions[i].event.start.substring(11,13)}${tutor_sessions[i].event.start.substring(14,16)}`);
                let dateEnd_b = parseInt(`${tutor_sessions[i].event.end.substring(11,13)}${tutor_sessions[i].event.end.substring(14,16)}`);

                //console.log(`${dateStart_a} - ${dateEnd_a} || ${dateStart_b} - ${dateEnd_b}`);
                
                if(dateStart_a == dateStart_b || dateEnd_a == dateEnd_b){
                    idSessions_interception.push(tutor_sessions[i]._id);
                }

                else if( dateStart_a > dateStart_b && dateStart_a < dateEnd_b){
                    idSessions_interception.push(tutor_sessions[i]._id);
                }

                else if( dateEnd_a<dateEnd_b && dateEnd_a > dateStart_b){
                    idSessions_interception.push(tutor_sessions[i]._id);
                }
            }
        }
        i = i+1;
    }


    //Eliminando las demas sesiones
    idSessions_interception.forEach( async (id) =>{
        try{
            await Session.updateOne({_id:id}, {status:'2'});
        }
        catch(err){
            res.status(500).send({message: 'Error update session', err:err});
        }   
    });


    //actualizando estado de la session 
    try{
        await Session.updateOne({_id:idSession}, {status:'1'});
    }
    catch(err){
        res.status(500).send({message: 'Error update session', err:err});
    }


    //Añadiendo el evento

    let tutor;
    try{
        tutor = await Student.findOne({_id:session.tutor}).exec();
    }
    catch(err){
        res.status(500).send({message: 'error getting tutor', err: err });
    }

    const newEvent ={
        title: session.event.title,
        start: session.event.start,
        end: session.event.end,
        color: session.event.color,
        textColor: session.event.textColor,
        overlap: session.event.overlap,
        selectable: session.event.selectable
    };

    tutor.events.push(newEvent);

    try{
        await Student.findOneAndUpdate({_id:session.tutor}, {events:tutor.events}, { new: true });
    }
    catch(err){
        res.status(500).send({message: 'Server Failed Adding Session Event', err:err});
    }
    


    //Responiendo la solicitud
    res.status(500).send({message: 'Request accept correctly', IdSessionRejects:idSessions_interception});
}






// Resolver solicitud
async function rejectRequest(req, res){
    let idSession = req.params.idSession;


    //Obteniendo datos de la sesion
    let session;
    try{
        session = await Session.findOne({_id:idSession});
    }
    catch(err){
        res.status(500).send({message:'Error getting session', err:err})
    }


    //Verificando el estado de la solicitud
    if(session.status != '0'){
        res.status(500).send({message:'Error request invalide'});
    }

    //Cancelando solicitud
    try{
        await Session.updateOne({_id:idSession}, {status:'2'});
    }
    catch(err){
        res.status(500).send({message: 'Error update session', err:err});
    }

    res.status(500).send({message: 'Request reject correctly'});
}


module.exports = { 
    addRequest,
    acceptRequest,
    rejectRequest
}