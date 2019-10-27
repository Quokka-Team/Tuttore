const AWS = require('./configSes');

const VerificationCodeView = require('../../views/verificationCodeView');

// Create updateTemplate parameters 
var params = {
    Template: { 
      TemplateName: 'verificationCodeTemplate', /* nombre del template que sale en SES -> tempaltes */
      HtmlPart: VerificationCodeView, /* Contenido del html. Formatear con : https://www.freeformatter.com/json-escape.html*/
      SubjectPart: 'Bienvenido',
      TextPart: 'Tu codigo de verificacion es {{verificationCode}}.' /* Hay algunos servicios de correos que no permiten mostrar html, se manda esto mejor  */
    }
};


// Create the promise and SES service object
var templatePromise = new AWS.SES({apiVersion: '2010-12-01'}).updateTemplate(params).promise();

// Handle promise's fulfilled/rejected states
templatePromise.then(
  function(data) {
    console.log("Template Updated");
  }).catch(
    function(err) {
    console.error(err, err.stack);
});