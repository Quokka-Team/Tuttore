// Load the SDK para JavaScript
const AWS = require('aws-sdk');

// Set the Region 
AWS.config.update({region: 'us-east-1'});

// Obsoleto
// AWS.config.update({
//     accessKeyId: "te la creiste wey",
//     secretAccessKey: "te la creiste wey x2",
//     "region": "us-east-1"
// });



//Cargando las credenciales de manera local OJO -> esto no sirve para deplyment.

//Como Hacerlo
//Tener un archivo llamado "credentials" tipo "FILE" en la ruta (...)/usuario_actual/.aws/
//este archivo debe tener el siguiente contenido

// [default] ; default profile
// aws_access_key_id = <DEFAULT_ACCESS_KEY_ID>
// aws_secret_access_key = <DEFAULT_SECRET_ACCESS_KEY>
    
// [personal-account] ; personal account profile
// aws_access_key_id = <PERSONAL_ACCESS_KEY_ID>
// aws_secret_access_key = <PERSONAL_SECRET_ACCESS_KEY>
    
// [work-account] ; work account profile
// aws_access_key_id = <WORK_ACCESS_KEY_ID>
// aws_secret_access_key = <WORK_SECRET_ACCESS_KEY></WORK_SECRET_ACCESS_KEY>

//Con lo siguiente simplemente se carga el archivo
//recuerde estar trabajando en un entorno de node y aws

const credentials = new AWS.SharedIniFileCredentials({profile: 'work-account'});
AWS.config.credentials = credentials;


module.exports = AWS