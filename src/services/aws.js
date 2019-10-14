// Load the SDK para JavaScript
const AWS = require('aws-sdk');

// Set the Region 
AWS.config.update({region: 'us-east-1'});


AWS.config.update({
    accessKeyId: "AKIAWZPRUIOD5N5YLMXK",
    secretAccessKey: "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",
    "region": "us-east-1"
});

module.exports = AWS