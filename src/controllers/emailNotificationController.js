//const AWS = require('../services/aws');

const AWS = require('../services/aws');

const createTemplateProvisional = require('../templates/templateSendEmailProvisional'); 



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





async function notifySession(email, type){
    if(type == 0){
        var params = {
            Destination: { CcAddresses: [email], ToAddresses: [email] },
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