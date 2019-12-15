//const AWS = require('../services/aws');

const AWS = require('../services/aws');

const createTemplateProvisional = require('../templates/templateSendEmailProvisional'); 

const Session = require('../models/session');
const Student = require('../models/student');
const Course = require('../models/course');



async function sendCodeVerification(req, res){
    const email = req.params.email;
    const number = `${getRandomInt(0,9)}${getRandomInt(0,9)}${getRandomInt(0,9)}${getRandomInt(0,9)}${getRandomInt(0,9)}${getRandomInt(0,9)}`;
    
    let replacementTags = {
        verificationCode : number
    };


    // Create sendTemplatedEmail params 
    let params = {
        Destination: { 
        CcAddresses: [
            email
        ],
        ToAddresses: [
            email
        ]
        },
        Source: 'QuokkaTeam2019@gmail.com', 
        Template: 'verificationCodeTemplate', 
        TemplateData: JSON.stringify(replacementTags), 
        ReplyToAddresses: [
        'QuokkaTeam2019@gmail.com'
        ],
    };
    let sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendTemplatedEmail(params).promise();

    sendPromise.then(
        function(data) {
        res.status(200).send({
            email: email,
            code: number
        });
    }).catch(
        function(err) {
        res.status(500).send({message: 'Error send verification code',  err:err});
    });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


async function sendEmailTemplate(req, res){
    const idSession = req.body.idSession;


    //Obteniendo datos de la sesion
    let session;
    try{
        session = await Session.findOne({_id:idSession});
    }
    catch(err){
        return res.status(500).send({message:'Error getting session', err:err});
    }


    try {
        const emailInformation = {
            recipient: 'tutor',
            emailMessage: 'El tutor -tutor- es aceptado por -student- para le curso -course-',
        }; 
        await notifySession(idSession, emailInformation);
    } catch(err){
        res.status(500).send({message:err});
    }

    res.status(200).send({
        message : "YES"
    });

}


async function notifySession(idSession, emailInformation){
    
    let emailMessage = emailInformation.emailMessage;
    let recipient = emailInformation.recipient;

    //Obteniendo session
    let session;

    try{
        session = await Session.findOne({_id:idSession});
    }
    catch(err){
        throw 'Error getting Session';
    }

    //Obteniendo tutor
    let tutor;
    try{
        tutor = await Student.findOne({_id:session.tutor});
    }
    catch(err){
        throw 'Error getting tutor' ;
    }


    //Obteniendo Student
    let student;
    try{
        student = await Student.findOne({_id:session.student});
    }
    catch(err){
        throw 'Error getting student';
    }

    //Obteniendo curso
    let course;
    try {
        course = await Course.findOne({_id:session.course});
    }
    catch(err){
        throw 'Error getting course';
    }

    var mapObj = {
        '-tutor-' : `${tutor.name} ${tutor.lastName}`,
        "-student-": `${student.name} ${student.lastName}`,
        "-course-": course.name
    };


    // insertando nombres en lugares correctos
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
    emailMessage = emailMessage.replace(re, function(matched){
        return mapObj[matched];
    });


    let email;

    if (recipient == 'tutor'){
        console.log('its a tutor!');
        email = tutor.email;
    } else {
        console.log('its a student!');
        email = student.email;
    }

    let replacementTags = {
        message : emailMessage
    };


    // Create sendTemplatedEmail params 
    let params = {
        Destination: { 
        CcAddresses: [
            email
        ],
        ToAddresses: [
            email
        ]
        },
        Source: 'QuokkaTeam2019@gmail.com', 
        Template: 'emailTemplate', 
        TemplateData: JSON.stringify(replacementTags), 
        ReplyToAddresses: [
        'QuokkaTeam2019@gmail.com'
        ],
    };

    
    let sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendTemplatedEmail(params).promise();

    sendPromise.then(
        function(data) {
            console.log('Email send sucessfuly');
    }).catch(
        function(err) {
            throw 'Error sending email';
    });


}

module.exports ={sendCodeVerification, notifySession, sendEmailTemplate}