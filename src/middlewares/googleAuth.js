'use strict'
const GoogleClientAuth = require("../services/googleAuth");


async function googleAuth(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Not have authorization please login'});
    }

    const token = req.headers.authorization.split(" ")[1];

    if( await GoogleClientAuth.verifyToken(token)){
        next();
    }
    else{
        res.status(401).send({message: 'Invalid Token'});
    }  
}

module.exports = googleAuth;


