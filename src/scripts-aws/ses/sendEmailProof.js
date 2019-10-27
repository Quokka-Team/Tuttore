const AWS = require("./configSes");

// Create sendEmail params 
var params = {
    Destination: {
      CcAddresses: [
        //'gabriel19oct@gmail.com'
        //'andrescamilo468@gmail.com'
        'jmedinan@unal.edu.co',
        'jdacostabe@unal.edu.co',
        'gavendanoc@unal.edu.co',
        'acastillos@unal.edu.co', 
        'cgilb@unal.edu.co'
      ],
      ToAddresses: [
        //'gabriel19oct@gmail.com'
        //'andrescamilo468@gmail.com'
        'jmedinan@unal.edu.co',
        'jdacostabe@unal.edu.co',
        'gavendanoc@unal.edu.co',
        'acastillos@unal.edu.co', 
        'cgilb@unal.edu.co'
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
         Charset: "UTF-8",
         Data: "<h1>Has sido selecciona para usar la version beta de Tuttore</h1>"
        },
        Text: {
         Charset: "UTF-8",
         Data: "TEXT_FORMAT_BODY"
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: 'Surprise - AWS Init'
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
