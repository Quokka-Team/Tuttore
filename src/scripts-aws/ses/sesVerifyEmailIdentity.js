const AWS = require("./configSes");


// Create promise and SES service object
//var verifyEmailPromise = new AWS.SES({apiVersion: '2010-12-01'}).verifyEmailIdentity({EmailAddress: "QuokkaTeam2019@gmail.com"}).promise();
var verifyEmailPromise = new AWS.SES({apiVersion: '2010-12-01'}).verifyEmailIdentity({EmailAddress: "gabriel19oct@gmail.com"}).promise();

// Handle promise's fulfilled/rejected states
verifyEmailPromise.then(
  function(data) {
    console.log("Email verification initiated");
   }).catch(
    function(err) {
    console.error(err, err.stack);
  });