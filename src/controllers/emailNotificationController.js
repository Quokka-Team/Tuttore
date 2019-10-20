//const AWS = require('../services/aws');

const AWS = require('../scripts-aws/ses/configSes');

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
        res.send(replacementTags);
    }).catch(
        function(err) {
        res.send(err);
    });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports ={sendCodeVerification}