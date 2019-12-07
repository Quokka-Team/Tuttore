//const AWS = require('../services/aws');

const AWS = require('../services/aws');

const createTemplateProvisional = require('../templates/templateSendEmailProvisional'); 

const Session = require('../models/session');
const Student = require('../models/student');



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





async function notifySession(idSession, type){
    
    //Obteniendo session
    let session;

    try{
        session = await Session.findOne({_id:idSession});
    }
    catch(err){
        throw 'Error getting session';
        return;
    }

    //Obteniendo tutor
    let tutor;
    try{
        tutor = await Student.findOne({_id:session.tutor});
    }
    catch(err){
        throw 'Error getting tutor';
    }


    //Obteniendo Student
    let student;
    try{
        student = await Student.findOne({_id:session.student});
    }
    catch(err){
        throw 'Error getting student';
    }
    



    if(type == 0){
        var params = {
            Destination: { CcAddresses: [tutor.email], ToAddresses: [tutor.email] },
            Message: { 
                Body: { 
                    Html: { Charset: "UTF-8", Data: "<h1>Tienes una solicitud</h1>"},
                    Text: { Charset: "UTF-8", Data: "TEXT_FORMAT_BODY" }
                },
                Subject: { Charset: 'UTF-8', Data: 'Surprise - AWS Init' }
            },
            Source: 'QuokkaTeam2019@gmail.com', 
            ReplyToAddresses: [ 'QuokkaTeam2019@gmail.com' ],
        }

         // Create the promise and SES service object
        var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
        
        // Handle promise's fulfilled/rejected states
        sendPromise.then(
            function(data) {
                console.log(data.MessageId);
                return;
            }).catch(
            function(err) {
                console.error(err, err.stack);
                return;
        });
    }

}

module.exports ={sendCodeVerification, notifySession}