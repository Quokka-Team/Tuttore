const AWS = require('../services/aws');
const createTemplateProvisional = require('../templates/templateSendEmailProvisional'); 

async function sendCodeVerification(req, res){
    const email = req.body.email;
    const subject = 'Code Verification Email';
    const number = `${getRandomInt(0,9)}${getRandomInt(0,9)}${getRandomInt(0,9)}${getRandomInt(0,9)}${getRandomInt(0,9)}${getRandomInt(0,9)}`;
    const message = `Your code verification is ${number}`;
    const params = createTemplateProvisional(email, message, subject);
    
    var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    
    sendPromise.then(
        function(data) {
            res.status(200).send({
                number: number
            });
        }).catch(
        function(err) {
            res.status(500).send({
                error:err
            });
        });
}



function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports ={sendCodeVerification}