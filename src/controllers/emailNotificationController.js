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




// async function notifySession(idSession, emailInformation){
    
//     let boton = `<div style="width: 220px; height:50px ;margin: 30px auto 30px auto;background:yellowgreen; display: flex; overflow: hidden; border-radius: 5px; ">
//                     <a href="https://tuttore-90660.firebaseapp.com/home-page" target="_blank" style="padding: 4% 25%; height: 100%; width: 100%;display: flex; justify-content: center; align-items: center; text-align: center; font-size: 22px; font-weight: bolder; text-decoration: none; background:#233d4d;color:#00bbf0;margin:auto;">Ir a Tuttore</a>
//                 </div>
//                 `;
    
//     let emailMessage = emailInformation.emailMessage;
//     emailMessage =  `${emailMessage} ${boton}`;

//     let recipient = emailInformation.recipient;

//     //Obteniendo session
//     let session;

//     try{
//         session = await Session.findOne({_id:idSession});
//     }
//     catch(err){
//         throw 'Error getting Session';
//     }

//     //Obteniendo tutor
//     let tutor;
//     try{
//         tutor = await Student.findOne({_id:session.tutor});
//     }
//     catch(err){
//         throw 'Error getting tutor' ;
//     }


//     //Obteniendo Student
//     let student;
//     try{
//         student = await Student.findOne({_id:session.student});
//     }
//     catch(err){
//         throw 'Error getting student';
//     }

//     //Obteniendo curso
//     let course;
//     try {
//         course = await Course.findOne({_id:session.course});
//     }
//     catch(err){
//         throw 'Error getting course';
//     }

//     var mapObj = {
//         '-tutor-' : `${tutor.name} ${tutor.lastName}`,
//         "-student-": `${student.name} ${student.lastName}`,
//         "-course-": course.name
//     };


//     // insertando nombres en lugares correctos
//     var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
//     emailMessage = emailMessage.replace(re, function(matched){
//         return mapObj[matched];
//     });


//     let email;

//     if (recipient == 'tutor'){
//         console.log('its a tutor!');
//         email = tutor.email;
//     } else {
//         console.log('its a student!');
//         email = student.email;
//     }

//     let replacementTags = {
//         message : emailMessage
//     };


//     // Create sendTemplatedEmail params 
//     let params = {
//         Destination: { 
//         CcAddresses: [
//             email
//         ],
//         ToAddresses: [
//             email
//         ]
//         },
//         Source: 'QuokkaTeam2019@gmail.com', 
//         Template: 'notifyTemplate', 
//         TemplateData: JSON.stringify(replacementTags), 
//         ReplyToAddresses: [
//         'QuokkaTeam2019@gmail.com'
//         ],
//     };

    
//     let sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendTemplatedEmail(params).promise();

//     sendPromise.then(
//         function(data) {
//             console.log('Email send sucessfuly');
//             return;
//     }).catch(
//         function(err) {
//             throw 'Error sending email';
//     });


// }




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


async function notifySession(idSession, emailInformation, subject){
    
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

    let dateAux = new Date(session.event.start);
    var mapObj = {
        '-tutor-' : `${tutor.name} ${tutor.lastName}`,
        "-student-": `${student.name} ${student.lastName}`,
        "-course-": course.name,
        "-date-": `${dateAux.getDate()}/${dateAux.getMonth()+1}/${dateAux.getFullYear()}`
    };


    // insertando nombres en lugares correctos
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
    emailMessage = emailMessage.replace(re, function(matched){
        return mapObj[matched];
    });

    subject = subject.replace(re, function(matched){
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

  


    emailMessage = `<html style=\"width:100%;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;\"><head> <meta charset=\"UTF-8\"> <meta content=\"width=device-width, initial-scale=1\" name=\"viewport\"> <meta name=\"x-apple-disable-message-reformatting\"> <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> <meta content=\"telephone=no\" name=\"format-detection\"> <title>New email template 2019-10-18<\/title> <!--[if (mso 16)]><style type=\"text\/css\"> a {text-decoration: none;} <\/style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }<\/style><![endif]--> <!--[if !mso]> --> <link href=\"https:\/\/fonts.googleapis.com\/css?family=Open+Sans:400,400i,700,700i\" rel=\"stylesheet\"> <!--<![endif]--> <style type=\"text\/css\"> @media only screen and (max-width:600px) { p, ul li, ol li, a { font-size: 16px !important; line-height: 150% !important } h1 { font-size: 32px !important; text-align: center; line-height: 120% !important } h2 { font-size: 26px !important; text-align: center; line-height: 120% !important } h3 { font-size: 20px !important; text-align: center; line-height: 120% !important } h1 a { font-size: 32px !important } h2 a { font-size: 26px !important } h3 a { font-size: 20px !important } .es-menu td a { font-size: 16px !important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size: 16px !important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size: 16px !important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size: 12px !important } *[class=\"gmail-fix\"] { display: none !important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align: center !important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align: right !important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align: left !important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display: inline !important } .es-button-border { display: inline-block !important } a.es-button { font-size: 16px !important; display: inline-block !important; border-width: 15px 30px 15px 30px !important } .es-btn-fw { border-width: 10px 0px !important; text-align: center !important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width: 100% !important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width: 100% !important; max-width: 600px !important } .es-adapt-td { display: block !important; width: 100% !important } .adapt-img { width: 100% !important; height: auto !important } .es-m-p0 { padding: 0px !important } .es-m-p0r { padding-right: 0px !important } .es-m-p0l { padding-left: 0px !important } .es-m-p0t { padding-top: 0px !important } .es-m-p0b { padding-bottom: 0 !important } .es-m-p20b { padding-bottom: 20px !important } .es-mobile-hidden, .es-hidden { display: none !important } .es-desk-hidden { display: table-row !important; width: auto !important; overflow: visible !important; float: none !important; max-height: inherit !important; line-height: inherit !important } .es-desk-menu-hidden { display: table-cell !important } table.es-table-not-adapt, .esd-block-html table { width: auto !important } table.es-social { display: inline-block !important } table.es-social td { display: inline-block !important } } #outlook a { padding: 0; } .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .es-button { mso-style-priority: 100 !important; text-decoration: none !important; } a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; } .es-desk-hidden { display: none; float: left; overflow: hidden; width: 0; max-height: 0; line-height: 0; mso-hide: all; } <\/style><\/head><body style=\"width:100%;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;\"> <div class=\"es-wrapper-color\" style=\"background-color:#EEEEEE;\"> <!--[if gte mso 9]><v:background xmlns:v=\"urn:schemas-microsoft-com:vml\" fill=\"t\"> <v:fill type=\"tile\" color=\"#eeeeee\"><\/v:fill> <\/v:background><![endif]--> <table class=\"es-wrapper\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;\"> <tr style=\"border-collapse:collapse;\"> <td valign=\"top\" style=\"padding:0;Margin:0;\"> <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;\"> <tr style=\"border-collapse:collapse;\"> <td align=\"center\" style=\"padding:0;Margin:0;\"> <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;\"> <tr style=\"border-collapse:collapse;\"> <td align=\"left\" bgcolor=\"#233D4D\" style=\"Margin:0;padding-top:20px;padding-bottom:20px;padding-left:35px;padding-right:35px;background-color:#233D4D;background-position:left top;\"> <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;\"> <tr style=\"border-collapse:collapse;\"> <td width=\"530\" align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;\"> <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;\"> <tr style=\"border-collapse:collapse;\"> <td align=\"center\" style=\"padding:0;Margin:0;\"><img class=\"adapt-img\" src=\"https:\/\/i.ibb.co\/19fwCPg\/64891571444501539.png\" alt style=\"display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;\" width=\"200\" height=\"62.89\"><\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <table class=\"es-content\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;\"> <tr style=\"border-collapse:collapse;\"> <td align=\"center\" style=\"padding:0;Margin:0;\"> <table class=\"es-content-body\" width=\"600\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#ffffff\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;\"> <tr style=\"border-collapse:collapse;\"> <td style=\"Margin:0;padding-left:30px;padding-right:30px;padding-top:40px;padding-bottom:40px;background-color:#F7F7F7;background-position:left top;\" bgcolor=\"#f7f7f7\" align=\"left\"> <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;\"> <tr style=\"border-collapse:collapse;\"> <td width=\"540\" valign=\"top\" align=\"center\" style=\"padding:0;Margin:0;\"> <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left top;\"> <tr style=\"border-collapse:collapse;\"> <\/tr> <tr style=\"border-collapse:collapse;\"> <td align=\"center\" style=\"padding:0;Margin:0;padding-bottom:15px;\"> <\/td> <\/tr> <tr style=\"border-collapse:collapse;\"> <td class=\"es-m-txt-c\" style=\"Margin:0;padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:15px;\"> <p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:18px;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:36px;color:#233D4D;text-align:center;\"> ${emailMessage}<div style="width: 220px; height:50px ;margin: 30px auto 30px auto;background:yellowgreen; display: flex; overflow: hidden; border-radius: 5px; "><a href="https://tuttore-90660.firebaseapp.com/home-page" target="_blank" style="padding: 4% 25%; height: 100%; width: 100%;display: flex; justify-content: center; align-items: center; text-align: center; font-size: 22px; font-weight: bolder; text-decoration: none; background:#233d4d;color:#00bbf0;margin:auto;">Ir a Tuttore</a></div><\/p> <\/td> <\/tr> <tr style=\"border-collapse:collapse;\"> <td align=\"center\" style=\"padding:0;Margin:0;\"> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/div><\/body><\/html>`


    // Create sendTemplatedEmail params 
    var params = {
        Destination: {CcAddresses: [email], ToAddresses: [email]},
        Message: { 
          Body: { 
            Html: {
             Charset: "UTF-8",
             Data: emailMessage
            },
            Text: {
             Charset: "UTF-8",
             Data: "TEXT_FORMAT_BODY"
            }
           },
           Subject: {
            Charset: 'UTF-8',
            Data: subject
           }
          },
        Source: 'QuokkaTeam2019@gmail.com', /* required */
        ReplyToAddresses: [
           'QuokkaTeam2019@gmail.com'
        ],
      };
      
      // Create the promise and SES service object
      var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
      
      // Handle promise's fulfilled/rejected states
      sendPromise.then(
        function(data) {
          console.log(data.MessageId);
        }).catch(
          function(err) {
          console.error(err, err.stack);
        });

}

module.exports ={sendCodeVerification, notifySession, sendEmailTemplate}