const {OAuth2Client} = require('google-auth-library');
const credentials = require('../credentials/credentials-GoogleAuth.json');

const clientGoogleAuth = new OAuth2Client(credentials.client_id);

async function verifyToken(token){
    try{
        console.log(token);
        const ticket = await clientGoogleAuth.verifyIdToken({
            idToken: token,
            audience: credentials.client_id
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

module.exports = {verifyToken};