// Load the SDK para JavaScript
const AWS = require('aws-sdk');

// Set the Region 
AWS.config.update({region: 'us-east-1'});


AWS.config.update({
    accessKeyId: "Consulte con Gabriel Avendano Casadiego",
    secretAccessKey: "Consulte con Camilo Andres Gil Ballen",
    "region": "us-east-1"
});

module.exports = AWS