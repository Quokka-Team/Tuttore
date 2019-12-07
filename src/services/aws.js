// Load the SDK para JavaScript
const AWS = require('aws-sdk');

// Set the Region 
AWS.config.update({region: 'us-east-1'});

//En este caso las credenciales se cargan desde EB usando un rol

//Se crea un rol con todos los permisos necesarios

//En el entorno, en la parte de configuracion -> seguridad -> Se selecciona dicho rol

//Automaticamente se caragaran todas las credenciales


//Local

module.exports = AWS