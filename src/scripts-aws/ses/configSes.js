// Load the SDK para JavaScript
const AWS = require('aws-sdk');

// Set the Region 
AWS.config.update({region: 'us-east-1'});


AWS.config.update({
    accessKeyId: "te la creiste wey",
    secretAccessKey: "te la creiste wey x2",
    "region": "us-east-1"
});

module.exports = AWS